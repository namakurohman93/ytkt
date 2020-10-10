# Build client side
FROM node:lts-alpine AS build

WORKDIR /usr/client

COPY ./client/package*.json ./

RUN npm ci

COPY ./client .

RUN npm run build


# Copy the result from build to production to minimize image size
FROM node:lts-alpine

WORKDIR /usr/ytkt

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY --from=build /usr/client/build ./public

RUN rm -rf client

EXPOSE 3000

CMD ["npm", "start"]
