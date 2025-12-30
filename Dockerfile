# Use official Node 20 slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if they exist
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of your app
COPY . .

# Expose Fly.io port
EXPOSE 3000

# Use Fly.io environment PORT
ENV PORT=3000

# Start your server
CMD ["node", "index.js"]
