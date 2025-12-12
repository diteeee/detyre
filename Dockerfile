FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Compile TS
RUN npm run build

# Run compiled JS
CMD ["node", "dist/index.js"]
