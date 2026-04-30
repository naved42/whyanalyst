# 1. Use Node base
FROM node:22-alpine

# 2. Install Python system-wide
RUN apk update && apk add --no-cache python3 py3-pip

WORKDIR /app

# 3. Install Node & Python dependencies BEFORE copying code (for caching)
COPY package*.json ./
RUN npm ci

# Install Python dependencies (only if requirements.txt exists)
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt --break-system-packages; else pip3 install --no-cache-dir pandas fastapi uvicorn python-multipart --break-system-packages; fi

# 4. Copy the rest and build frontend
COPY . .
RUN npm run build

# 5. Set Environment
ENV NODE_ENV=production
ENV PORT=8080

# 6. Start the server directly
CMD ["npm", "start"]