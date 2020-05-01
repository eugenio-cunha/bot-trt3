import { Redis, Chromium } from './lib';

export default class Bot {

  private async resolver(target: string, value: string) {
    const parameters = JSON.parse(value);
    const { id, code, instance } = parameters;
    
    const page = await Chromium.newPage();
    const url = `https://pje-consulta.trt3.jus.br/consultaprocessual/detalhe-processo/${code}`;
    page.goto(url, { waitUntil: 'domcontentloaded' });

    console.info('-->', target, value);
  }
  
  public listen(target: string, callback: () => void ) {
    Redis.subscribe(target, this.resolver);

    callback();
  }
}