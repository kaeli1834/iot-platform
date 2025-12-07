# ----------------------------------------------------
# 1. BASE IMAGE FOR THE BUILD (Node + TS compiler)
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build



# ----------------------------------------------------
# 2. PRODUCTION IMAGE (only compiled JS + node_modules)
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the compiled output from /dist
COPY --from=builder /app/dist ./dist

# Copy production node_modules (we install again in prod mode)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Environment
ENV NODE_ENV=production

# Expose the NestJS default port
EXPOSE 3000

# Start your app
CMD ["node", "dist/main.js"]
