FROM node:alpine AS build

ENV HOME=/usr/src/app
WORKDIR ${HOME}
COPY . $HOME

RUN npm install --silent \
    && npm run build

FROM node:alpine AS production

RUN apk update && apk upgrade

EXPOSE 80

ENV TARGET=trt3
ENV HOME=/usr/src/app
ENV NODE_ENV=production

WORKDIR $HOME

COPY --from=build ./usr/src/app/ $HOME
COPY package.json $HOME

RUN npm install --silent --production && npm rebuild --quiet

CMD [ "npm", "start" ]