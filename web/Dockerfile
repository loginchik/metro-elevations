FROM node:18

WORKDIR /web

COPY package*.json ./
RUN npm install

EXPOSE 5173

CMD [ "npx", "vite", "--host" ]