FROM node:16.14.2-alpine as development

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

COPY --from=development /app/build/ ./build/

COPY --from=development /app/entrypoint.sh .

EXPOSE 3001

RUN pwd && ls -al

RUN chmod +x /app/entrypoint.sh

CMD [ "/app/entrypoint.sh" ]
