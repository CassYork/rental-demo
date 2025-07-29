# Deployment Guide

This guide will help you deploy the B2B Commerce Starter using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repository-url>
   cd b2b-starter-medusa
   ```

2. **Deploy using the script**:
   ```bash
   ./deploy.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build -d
   ```

## Services Overview

The deployment includes 4 services:

- **Database** (PostgreSQL): `localhost:5432`
- **Redis** (Cache): `localhost:6379`
- **Backend** (Medusa API + Admin): `localhost:9000`
- **Storefront** (Next.js): `localhost:8000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgres://medusa_user:supersecret@db:5432/medusa_db

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT and Security
JWT_SECRET=your-super-secret-jwt-key-here
COOKIE_SECRET=your-super-secret-cookie-key-here

# CORS Configuration
STORE_CORS=http://localhost:8000,http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000

# Medusa Backend URL (for storefront)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://backend:9000

# Publishable API Key (you'll need to get this from the admin panel)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key_here

# Node Environment
NODE_ENV=production
```

## Initial Setup

After deployment, you need to:

1. **Access the Admin Panel**: http://localhost:9000/app
2. **Create an admin user**:
   ```bash
   docker-compose exec backend yarn medusa user -e admin@test.com -p supersecret -i admin
   ```
3. **Seed the database**:
   ```bash
   docker-compose exec backend yarn run seed
   ```
4. **Get the Publishable API Key**:
   - Go to Admin Panel → Settings → Publishable API Keys
   - Copy the "Webshop" key
   - Update the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in your `.env` file
   - Restart the storefront service:
     ```bash
     docker-compose restart storefront
     ```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f storefront

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Update and restart
docker-compose up --build -d

# Access database
docker-compose exec db psql -U medusa_user -d medusa_db

# Access backend container
docker-compose exec backend sh

# Access storefront container
docker-compose exec storefront sh
```

## Production Considerations

For production deployment, consider:

1. **Security**:
   - Change default passwords
   - Use strong JWT and cookie secrets
   - Configure proper CORS settings
   - Use HTTPS

2. **Performance**:
   - Use external PostgreSQL and Redis services
   - Configure proper resource limits
   - Set up monitoring and logging

3. **Scalability**:
   - Use load balancers
   - Configure auto-scaling
   - Set up CDN for static assets

## Troubleshooting

### Services not starting
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database connection issues
```bash
# Check database health
docker-compose exec db pg_isready -U medusa_user -d medusa_db

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up -d
```

### Storefront not loading
- Check if the backend is running
- Verify the publishable API key is correct
- Check CORS settings

## Access URLs

- **Storefront**: http://localhost:8000
- **Admin Panel**: http://localhost:9000/app
- **API Documentation**: http://localhost:9000/store/docs
- **Admin API Documentation**: http://localhost:9000/admin/docs 