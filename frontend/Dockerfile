# Stage 1: Build the frontend application
FROM node:22-alpine AS builder
WORKDIR /app

# Cache dependency installation
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . ./

ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx html and copy built artifacts
RUN rm -rf ./*
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
