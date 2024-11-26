FROM node:20-alpine as base

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files and global.css first
COPY apps/client/package*.json ./
COPY apps/client/global.css ./

# Install app dependencies
RUN npm install

FROM base as development
CMD ["npm", "start", "--web"]

FROM base as production
# Copy the entire client directory for production
COPY apps/client/ .
CMD ["npm", "start", "--web"]
