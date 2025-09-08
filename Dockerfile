FROM node:22-alpine
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run build

EXPOSE 3000

USER node
CMD ["sh", "-c", "npm run migration:run && node dist/src/main.js"]