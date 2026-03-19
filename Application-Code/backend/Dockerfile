FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# 🔹 Install only production dependencies (no test/dev tools)
RUN npm install --omit=dev

COPY . .

USER node

ENV NODE_ENV=production
ENV PORT=3500

EXPOSE 3500

CMD ["node", "index.js"]