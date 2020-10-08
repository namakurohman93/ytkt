FROM node:lts-alpine

WORKDIR /usr/ytkt

COPY . .

RUN npm run install-all && npm run build

EXPOSE 3000

CMD ["npm", "start"]
