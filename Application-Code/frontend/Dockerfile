FROM node:18-alpine

WORKDIR /usr/src/app

# 🔹 Copy only the package files first (This makes builds 10x faster!)
COPY package*.json ./

# 🔹 Install only the essential libraries for production
RUN npm install --omit=dev

# 🔹 Copy the rest of your pretty code
COPY . .

# 🔹 Security: Don't run the app as 'root'
USER node

ENV NODE_ENV=production
ENV PORT=3500
EXPOSE 3500

CMD ["node", "index.js"]