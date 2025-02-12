FROM node:16

WORKDIR /app

LABEL author = "Alicia Pineda Quiroga"

COPY ./src .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

