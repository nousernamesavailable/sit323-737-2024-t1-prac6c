# Using an official Node.js base image
FROM node:16

# create app directory
WORKDIR /app

#install dependencies
# wildcard used to ensure both package files are copied
COPY package*.json ./

RUN npm install

# copy rest of application code 
COPY . .

EXPOSE 3040

CMD [ "node", "server.js" ]