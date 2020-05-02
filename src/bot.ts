import fetch from 'node-fetch';
import { Doc } from './interfaces';
import { Mongo, Captcha, Notification } from './lib';

export default class Bot {

  private target: string;

  public constructor(target: string) {
    this.target = target;
  }

  private async ping() {
    const { status } = await fetch('https://pje-consulta.trt3.jus.br/pje-consulta-api/');
    if (status !== 200) throw new Error('O portal de consulta TRT3 está indisponível!');
  }

  private async captcha(code: string, instance: string): Promise<Doc> {
    const host = 'https://pje-consulta.trt3.jus.br'
    const options = { method: 'get', headers: { 'X-Grau-Instancia': instance, 'Content-Type': 'application/json' } };

    const responseIdentifier = await fetch(`${host}/pje-consulta-api/api/processos/dadosbasicos/${code}`, options);
    const [data] = await responseIdentifier.json();

    if (!(data && data.id)) throw new Error('Não foi possível recuperar o identificador do processo nesta instância!');
    const { id } = data;

    const responseChallenge = await fetch(`${host}/pje-consulta-api/api/processos/${id}`, options);
    const challenge = await responseChallenge.json();

    if (!(challenge['imagem'] && challenge['tokenDesafio']))
      throw new Error('A imagem ou token do desafio não foram recuperados!');

    const text = await Captcha.solve(challenge.imagem);

    if (!text || text === '')
      throw new Error('A imagem de captcha não foi resolvida!');

    return { identifier: id, token: challenge['tokenDesafio'], text };
  }

  private async extract(id: string, instance: string, token: string, text: string): Promise<Doc> {
    const options = { method: 'get', headers: { 'X-Grau-Instancia': instance, 'Content-Type': 'application/json' } };
    const host = 'https://pje-consulta.trt3.jus.br';
    const url = `${host}/pje-consulta-api/api/processos/${id}?tokenDesafio=${token}&resposta=${text}`;
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data || data['imagem']) throw new Error('O texto do captcha não foi resolvido corretamente!');

    return data;
  }

  private async save(id: string, value: any) {
    const objId = Mongo.objectId(id);
    await Mongo.insert(this.target, 'data', { request: objId, ...value });
    await Mongo.update(this.target, 'request', { '_id': objId }, { status: 'done', end: new Date() });
  }

  public async solve(value: { [key: string]: any }) {
    try {
      const { id, code, instance } = value;
      if (!(id && code && instance)) throw new Error('Parâmetros de solicitação são obrigatórios');

      await this.ping();
      const { identifier, token, text } = await this.captcha(code, instance);
      const data = await this.extract(identifier, instance, token, text);
      await this.save(id, data);

    } catch ({ message }) {
      const objId = Mongo.objectId(value.id);
      await Mongo.update(this.target, 'request', { '_id': objId }, { status: 'failed', message, end: new Date() });
    }
  }

  public listen(callback: () => void) {
    Notification.listen(this.target, this.solve.bind(this))
    callback();
  }
}