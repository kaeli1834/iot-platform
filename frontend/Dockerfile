FROM node:lts-alpine AS builder
# Update all base Alpine OS packages to their latest patched versions
RUN apk update && apk upgrade --no-cache
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# build production static assets
RUN npm run build

FROM nginx:stable-alpine AS runtime

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]