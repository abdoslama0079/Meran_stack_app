FROM node:14-slim AS build
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install --only=production

FROM node:14-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

USER node

EXPOSE 8080
CMD ["node", "index.js"]
