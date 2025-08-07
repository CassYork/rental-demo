FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy source code and env file
COPY . .

# Make sure our entrypoint is executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose Medusa default port
EXPOSE 9000

# Run migrations, seeding, and start Medusa
CMD ["/app/entrypoint.sh"]
