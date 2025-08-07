FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN yarn install

# Copy everything
COPY . .

# Expose Medusa port
EXPOSE 9000

# Start Medusa
CMD ["sh", "-c", "yarn medusa db:create && yarn medusa db:migrate && yarn run seed && yarn medusa user -e admin@test.com -p supersecret -i admin && yarn run start"]