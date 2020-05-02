import fetch from 'node-fetch';
import { Captcha } from './lib';
import { Notification } from './lib';

export default class Bot {


  private async id(code: string, instance: string): Promise<string> {
    const options = { method: 'get', headers: { 'X-Grau-Instancia': instance, 'Content-Type': 'application/json' } };
    const url = `https://pje-consulta.trt3.jus.br/pje-consulta-api/api/processos/dadosbasicos/${code}`;
    const response = await fetch(url, options);
    const [data] = await response.json();

    return data.id;
  }

  private async captcha(id: string) {
    const options = { method: 'get', headers: { 'Content-Type': 'application/json' } };
    const url = `https://pje-consulta.trt3.jus.br/pje-consulta-api/api/processos/${id}`;
    const response = await fetch(url, options);
    const data = await response.json();
    const text = await Captcha.solve(data.imagem);
    const result = { token: data['tokenDesafio'], text };

    return result;
  }

  private async miner(id: string, instance: string, token: string, text: string) {
    const options = { method: 'get', headers: { 'X-Grau-Instancia': instance, 'Content-Type': 'application/json' } };
    const host = 'https://pje-consulta.trt3.jus.br';
    const url = `${host}/pje-consulta-api/api/processos/${id}?tokenDesafio=${token}&resposta=${text}`;
    const response = await fetch(url, options);

    return await response.json();
  }

  private async resolver(value: { [key: string]: any }) {
    const { code, instance } = value;
    const id = await this.id(code, instance);

    const { token, text } = await this.captcha(id);
    const data = await this.miner(id, instance, token, text || '');

    console.info('-->', data);
  }

  public listen(target: string, callback: () => void) {
    Notification.listen(target, this.resolver.bind(this))
    callback();
  }
}