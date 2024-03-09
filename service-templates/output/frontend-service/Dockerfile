FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN 
EXPOSE 8080
CMD [ "npm", "start" ]
