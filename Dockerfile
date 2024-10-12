FROM node:20.10.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]

# docker build -t your-image-name .
# docker run -p 3000:3000 your-image-name
