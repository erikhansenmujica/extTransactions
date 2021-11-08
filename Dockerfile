
FROM node:12.19.0-alpine3.9 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install -g @nestjs/cli

RUN npm install

RUN npm run build

COPY . .

CMD ["node", "dist/main"]