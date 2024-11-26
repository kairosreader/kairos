FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files and global.css first
COPY apps/client/package*.json ./
COPY apps/client/global.css ./

# Install app dependencies
RUN npm install

# Copy the entire client directory
COPY apps/client/ .

# Expose port
EXPOSE 8081

# Start the app
CMD ["npm", "start", "--", "--web"]
