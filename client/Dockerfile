FROM node:16.14.2-alphine as build

USER node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:16.14.2-alphine as production

USER node

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}}

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/build/ ./build

EXPOSE 3000

RUN chmod +x entrypoint.sh

CMD [ "/app/entrypoint.sh" ]
