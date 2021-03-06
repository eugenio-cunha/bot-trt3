# BOT-TRT3

### MVP
* Implementar um robô para executar consultas automatizadas de processos no portal do Tribunal Regional do Trabalho.
* Requisitos básicos, robô escalável.

### Variáveis de ambiente
```env
TARGET=trt3                                    (nome do robô)
NODE_ENV=development                           (ambiente da aplicação)
SOCKET_PORT=9018                               (porta do socket que o robô vai escutar)
SOCKET_HOST=127.0.0.1                          (host do socket que o robô vai escutar)
MONGODB_HOST=127.0.0.1                         (host de conexão com MongoDB) 
MONGODB_PORT=27017                             (port de conexão com MongoDB) 
ACCESS_TOKEN=******************************    (token de acesso ao serviço 2captcha.com)
```

### Diagrama

![diagrama](https://github.com/eugenio-cunha/api-trt/blob/master/diagram.png)

```sh
# build da aplicação de TypeScript para JavaScript
npm run build

# executa os testes de unidade
npm test

# executa a aplicação no modo desenvolvimento
npm run dev

# executa a aplicação no modo produção
npm start

```

API-TRT [Repositório](https://github.com/eugenio-cunha/api-trt)

### TO-DO
- [ ] Melhorar as mensagens de erros do robô.
- [ ] Implementar uma rotina para enviar novamente para o server todos os pedidos que não foram resolvidos.