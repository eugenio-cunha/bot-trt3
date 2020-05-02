# BOT-TRT3

### MVP
* Implementar um robô para executar consultas automatizadas de processos no portal do Tribunal Regional do Trabalho.
* Requisitos básicos, robô escalável.

### Variáveis de ambiente
```env
NODE_ENV=development                           (ambiente da aplicação)
SOCKET_PORT=9018                               (porta do socket que o robô vai escutar)
MONGODB_URL=mongodb://127.0.0.1:27017/${db}    (url de conexão com MongoDB) 
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