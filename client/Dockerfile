# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/htmls

# Expose port 80 (default HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]