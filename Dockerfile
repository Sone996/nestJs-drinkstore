FROM node:16.17.0-alpine as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

RUN pnpm prisma generate

RUN pnpm prisma migrate deploy

CMD [ "node", "dist/main.js" ]
