FROM node:16.14.2-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.14.2-alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}}

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/build/ ./build

COPY --from=build /app/entrypoint.sh .

EXPOSE 3000

RUN pwd && ls -al

RUN chmod +x /app/entrypoint.sh

CMD [ "/app/entrypoint.sh" ]
