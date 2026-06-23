# Using Lightweight docker image for node
FROM node:20-alpine AS build

# Setting Up Working Directory
WORKDIR /usr/src/backend-app

# Copying Package Files
COPY package*.json ./

# Installing all Dependencies (including devDeps for build)
RUN npm ci --ignore-scripts

# Copying Files
COPY . .

# Build project
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runtime

WORKDIR /usr/src/backend-app

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

COPY --from=build /usr/src/backend-app/dist ./dist

# Exposing Port
EXPOSE 7860

# Start Application
CMD ["node", "dist/bin/server.js"]