FROM node:13.12-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --silent
COPY . .

RUN npm run build
CMD npm run start

EXPOSE 3002
