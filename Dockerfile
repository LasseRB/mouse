FROM node:16
WORKDIR /index.html
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "./server/server.js" ]