FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package.json server/package-lock.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Copy source code
WORKDIR /app
COPY server ./server
COPY client ./client

# Expose port
EXPOSE 3000

# Start server
WORKDIR /app/server
CMD ["node", "index.js"]
