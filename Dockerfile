FROM node:lts
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000

USER node
CMD ["node", "dist/main.js"]
