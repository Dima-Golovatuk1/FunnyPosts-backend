FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && node dist/src/main"]