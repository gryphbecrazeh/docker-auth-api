FROM node:latest

WORKDIR /usr/src/app

COPY ./express/package*.json ./

RUN npm install

COPY ./express/ ./

CMD ["npm", "start"]