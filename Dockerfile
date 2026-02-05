FROM node:18-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN apt-get update && \
    apt-get install -y python3 build-essential libsqlite3-dev ca-certificates && \
    npm ci --only=production && \
    apt-get purge -y --auto-remove python3 build-essential && \
    rm -rf /var/lib/apt/lists/*
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]