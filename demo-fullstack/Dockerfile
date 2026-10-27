FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm ci --only=production || npm install --only=production
COPY . .
RUN cd frontend && npm ci && npm run build || echo "Frontend build skip"
EXPOSE 3000
CMD ["node","backend/server.js"]
