FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

COPY --from=build /app/dist ./dist

# Create default .env for production (override via HF Secrets)
RUN echo "ENV=production\nPORT=7860\nSERVER_URL=\nDATABASE_URL=\nCORS_ORIGINS=*\nEMAIL_SERVICE_API_KEY=\nACCESS_TOKEN_SECRET=\nREFRESH_TOKEN_SECRET=\nSALT_ROUNDS=10" > .env

EXPOSE 7860

CMD ["node", "dist/bin/server.js"]
