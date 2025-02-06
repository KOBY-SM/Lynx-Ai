FROM node:20.18.2-bookworm-slim

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install 

COPY . .
RUN npm start 
EXPOSE 5000

CMD ["node", "index.js", "--server"]