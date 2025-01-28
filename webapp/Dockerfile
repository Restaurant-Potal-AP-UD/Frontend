FROM node:16

WORKDIR /app

LABEL author = "Alicia Pineda Quiroga"

COPY package*.json ./

RUN npm install
CMD ["npm", "start"]
EXPOSE 3000
