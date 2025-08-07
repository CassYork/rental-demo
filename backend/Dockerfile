# Development Dockerfile for Medusa
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and yarn config
COPY package.json yarn.lock ./

# Install all dependencies using yarn
RUN yarn install

# Copy source code
COPY . .

# Make sure our entrypoint is executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose the port Medusa runs on
EXPOSE 9000

# Run migrations, seeding, and start Medusa
CMD ["/app/entrypoint.sh"]
