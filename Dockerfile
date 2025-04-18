# server/Dockerfile

FROM node:18
WORKDIR /app

# Copy package.json and install dependencies first
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Expose your backend port
EXPOSE 5000

# Run the server
CMD ["node", "server.js"]
