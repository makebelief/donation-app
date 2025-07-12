# African Social Projects Donation Platform

![Screenshot](./readme_preview.png)

A production-ready web application built with SvelteKit, PostgreSQL, and Redis that enables secure donations to various social projects in Africa through M-Pesa integration.

## Features

- Anonymous and authenticated donations to social projects
- Secure M-Pesa integration for mobile payments
- Admin dashboard with real-time analytics
- Rate limiting and security measures
- Caching with Redis
- Comprehensive logging and monitoring
- African-themed responsive UI
- PostgreSQL database with migrations
- Docker deployment support

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v15 or later)
- Redis (v7 or later)
- Docker and Docker Compose (for containerized deployment)
- M-Pesa Daraja API credentials

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd donation-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (see `.env.example` for required variables)

4. Start the development environment:
```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d db cache

# Initialize the database
npm run migrate:dev

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

## Production Deployment

### Using Docker (Recommended)

1. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your production values
```

2. Build and start the containers:
```bash
# Build the images
docker-compose build

# Start the services
docker-compose up -d
```

3. Initialize the database:
```bash
docker-compose exec app npm run migrate:deploy
docker-compose exec app npm run seed
```

### Manual Deployment

1. Set up PostgreSQL and Redis servers

2. Configure environment variables

3. Build the application:
```bash
npm run build
```

4. Start the production server:
```bash
npm run start
```

## Database Management

### Migrations

Create a new migration:
```bash
npm run migrate:dev -- --name your_migration_name
```

Apply migrations:
```bash
npm run migrate:deploy
```

Reset database:
```bash
npm run migrate:reset
```

### Backup and Restore

Backup:
```bash
docker-compose exec db pg_dump -U postgres donation_db > backup.sql
```

Restore:
```bash
docker-compose exec -T db psql -U postgres donation_db < backup.sql
```

## Monitoring and Maintenance

### Health Checks

The application exposes a health check endpoint at `/health` that monitors:
- Database connectivity
- Redis connection
- M-Pesa API status

### Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

### Performance Monitoring

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Rate limiting to prevent abuse

## Security Features

- HTTPS enforcement
- CSRF protection
- Rate limiting
- SQL injection prevention
- XSS protection
- Security headers
- Input validation
- Password hashing
- Session management

## Testing

Run tests:
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [support@example.com](mailto:support@example.com)

## Acknowledgments

- SvelteKit for the framework
- Prisma for database ORM
- Tailwind CSS for styling
- M-Pesa for payment integration 