FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app/
RUN npm install
