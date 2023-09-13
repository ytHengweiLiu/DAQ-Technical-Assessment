FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=12000

EXPOSE 12000

CMD [ "npm", "start" ]