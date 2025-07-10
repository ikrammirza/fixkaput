FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
#build command
RUN npm run build

EXPOSE 3000
# Start the production server
CMD ["npm", "start"]


