# ============================================================================
# PAINRELIEF AI - COMPLETE DEPLOYMENT & SETUP GUIDE
# ============================================================================
# A comprehensive guide to deploy PainRelief AI to production

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Setup](#database-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [API Integration](#api-integration)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Deployment (AWS)](#cloud-deployment-aws)
8. [Cloud Deployment (Heroku)](#cloud-deployment-heroku)
9. [Cloud Deployment (DigitalOcean)](#cloud-deployment-digitalocean)
10. [Monitoring & Scaling](#monitoring--scaling)
11. [Security Best Practices](#security-best-practices)
12. [Troubleshooting](#troubleshooting)

---

## LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL 12+ (https://www.postgresql.org/)
- npm or yarn
- Git
- Visual Studio Code (recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/painrelief-ai.git
cd painrelief-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env with your local settings
nano .env
```

Key environment variables to set:
- `NODE_ENV=development`
- `PORT=5000`
- `DB_HOST=localhost`
- `DB_NAME=painrelief_ai`
- `ANTHROPIC_API_KEY=your_api_key`
- `JWT_SECRET=your_secret_key`

### Step 4: Start Development Servers
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run dev:frontend

# Or run both concurrently
npm run dev:all
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173

---

## DATABASE SETUP

### Step 1: Install PostgreSQL

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
- Download from https://www.postgresql.org/download/windows/
- Run installer and follow prompts
- Remember the password you set for postgres user

### Step 2: Create Database User
```bash
psql -U postgres

# In psql prompt:
CREATE USER painrelief_user WITH PASSWORD 'secure_password_here';
ALTER ROLE painrelief_user WITH SUPERUSER;
```

### Step 3: Initialize Database Schema
```bash
npm run db:init
# Or manually:
psql -U postgres -f database_schema.sql
```

### Step 4: Seed Initial Data (Optional)
```bash
npm run seed
npm run seed:exercises
npm run seed:medications
```

### Step 5: Verify Database
```bash
psql -U postgres -d painrelief_ai

# In psql prompt:
\dt  # List all tables
SELECT * FROM users;  # Check if tables are created
```

### Backup & Restore
```bash
# Backup
npm run db:backup
# Or manually:
pg_dump painrelief_ai > backup.sql

# Restore
psql painrelief_ai < backup.sql

# Reset database
npm run db:reset
```

---

## BACKEND CONFIGURATION

### Step 1: API Keys Setup

#### Anthropic API Key
1. Sign up at https://console.anthropic.com
2. Get your API key from the dashboard
3. Add to .env: `ANTHROPIC_API_KEY=sk-ant-xxx`

#### JWT Configuration
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=<generated_secret>
JWT_EXPIRY=30d
```

### Step 2: Email Configuration (Optional but recommended)

#### Using Gmail SMTP
1. Enable 2-factor authentication on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to .env:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@painrelief.ai
```

#### Using Mailgun
1. Sign up at https://www.mailgun.com
2. Get API key and domain
3. Add to .env:
```
MAILGUN_API_KEY=key-xxx
MAILGUN_DOMAIN=mg.painrelief.ai
```

### Step 3: Payment Processing (Optional)

#### Stripe Setup
1. Create account at https://stripe.com
2. Get API keys from dashboard
3. Add to .env:
```
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

#### Razorpay Setup (for India)
1. Create account at https://razorpay.com
2. Get Key ID and Key Secret
3. Add to .env:
```
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

### Step 4: Start Backend
```bash
npm run dev

# Expected output:
# 🚀 PainRelief AI API running on port 5000
# 📝 Environment: development
# 🗄️  Database: painrelief_ai
```

---

## FRONTEND CONFIGURATION

### Step 1: Create Vite Config
File: `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Step 2: Update API Endpoint
File: `src/config/api.js`
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
  PAIN_LOG: `${API_BASE_URL}/api/pain/log`,
  // ... more endpoints
}
```

### Step 3: Environment Variables
File: `.env.local`
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=PainRelief AI
VITE_APP_VERSION=1.0.0
```

### Step 4: Start Frontend
```bash
npm run dev:frontend

# Expected output:
# VITE v5.0.0  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

---

## API INTEGRATION

### Authentication Flow

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response includes JWT token
```

#### 3. Use Token in Requests
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### Chat with AI Doctor
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "I have knee pain",
    "language": "en",
    "conversationHistory": []
  }'
```

### Log Pain Level
```bash
curl -X POST http://localhost:5000/api/pain/log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "level": 7,
    "type": "knee",
    "notes": "Pain while walking"
  }'
```

---

## DOCKER DEPLOYMENT

### Step 1: Create Dockerfile
File: `Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Step 2: Create Docker Compose
File: `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: painrelief_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: painrelief_ai
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database_schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U painrelief_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_USER=painrelief_user
      - DB_PASSWORD=secure_password
      - DB_NAME=painrelief_ai
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

### Step 3: Build and Run
```bash
# Build image
npm run docker:build

# Or using docker-compose
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop
docker-compose down
```

---

## CLOUD DEPLOYMENT (AWS)

### Option 1: AWS Elastic Beanstalk

#### Step 1: Install EB CLI
```bash
pip install awsebcli --upgrade --user
```

#### Step 2: Initialize EB
```bash
eb init -p node.js-18 painrelief-ai --region us-east-1
eb create painrelief-ai-prod
```

#### Step 3: Configure Environment
```bash
eb setenv \
  NODE_ENV=production \
  DB_HOST=<rds-endpoint> \
  DB_NAME=painrelief_ai \
  ANTHROPIC_API_KEY=<key> \
  JWT_SECRET=<secret> \
  STRIPE_SECRET_KEY=<key>
```

#### Step 4: Deploy
```bash
npm run build
eb deploy
```

### Option 2: AWS ECS (Elastic Container Service)

#### Step 1: Create ECR Repository
```bash
aws ecr create-repository --repository-name painrelief-ai --region us-east-1
```

#### Step 2: Build and Push Image
```bash
docker build -t painrelief-ai .
docker tag painrelief-ai:latest <account>.dkr.ecr.us-east-1.amazonaws.com/painrelief-ai:latest
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/painrelief-ai:latest
```

#### Step 3: Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name painrelief-ai-prod
```

### Database: AWS RDS

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier painrelief-ai-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <strong_password> \
  --allocated-storage 20 \
  --backup-retention-period 30

# Get endpoint
aws rds describe-db-instances --db-instance-identifier painrelief-ai-db
```

---

## CLOUD DEPLOYMENT (HEROKU)

### Step 1: Create Heroku App
```bash
heroku login
heroku create painrelief-ai-prod
```

### Step 2: Add PostgreSQL Add-on
```bash
heroku addons:create heroku-postgresql:mini
heroku pg:push ./database_schema.sql DATABASE_URL
```

### Step 3: Set Environment Variables
```bash
heroku config:set \
  NODE_ENV=production \
  ANTHROPIC_API_KEY=<key> \
  JWT_SECRET=<secret> \
  STRIPE_SECRET_KEY=<key>
```

### Step 4: Deploy
```bash
git push heroku main

# View logs
heroku logs --tail
```

---

## CLOUD DEPLOYMENT (DigitalOcean)

### Step 1: Create App
```bash
doctl apps create --spec app.yaml
```

### Step 2: Create Database
```bash
doctl databases create \
  --engine pg \
  --region nyc3 \
  --size db-s-1vcpu-1gb \
  painrelief-db
```

### Step 3: Deploy
```bash
doctl apps update <app-id> --spec app.yaml
```

---

## MONITORING & SCALING

### Application Monitoring

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "painrelief-ai"
pm2 start "npm run dev:frontend" --name "painrelief-frontend"

# Monitor
pm2 monit

# View logs
pm2 logs painrelief-ai

# Setup auto-restart
pm2 startup
pm2 save
```

#### Using Sentry for Error Tracking
```bash
# Add to code
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

#### Using DataDog
```bash
# Install agent
npm install --save dd-trace

# Initialize in server.js
const tracer = require('dd-trace').init();
```

### Database Monitoring
```bash
# Check slow queries
psql -c "SELECT query FROM pg_stat_statements WHERE mean_exec_time > 1000 ORDER BY mean_exec_time DESC LIMIT 10;"

# Analyze table
ANALYZE users;
VACUUM ANALYZE users;
```

### Load Testing
```bash
# Using Apache Bench
ab -n 10000 -c 100 http://localhost:5000/api/health

# Using Artillery
npm install -g artillery
artillery quick --count 300 --num 1000 http://localhost:5000/api/health
```

---

## SECURITY BEST PRACTICES

### 1. Environment Variables
- ✓ Never commit .env to git
- ✓ Use .env.example as template
- ✓ Rotate secrets regularly
- ✓ Use environment-specific configurations

### 2. Database Security
```bash
# Use strong passwords
ALTER USER painrelief_user WITH PASSWORD 'new_secure_password';

# Enable SSL connections
# In postgresql.conf: ssl = on

# Restrict connections
# In pg_hba.conf: host painrelief_ai all 192.168.1.0/24 md5
```

### 3. API Security
```javascript
// Enable CORS properly
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());
```

### 4. HTTPS/TLS
```bash
# Generate SSL certificate
sudo certbot certonly --standalone -d api.painrelief.ai -d app.painrelief.ai

# Use in Express
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/cert.pem')
};

https.createServer(options, app).listen(443);
```

### 5. Data Protection
- ✓ Encrypt sensitive data in database
- ✓ Hash passwords with bcrypt (10+ rounds)
- ✓ Use HTTPS everywhere
- ✓ Implement data retention policies
- ✓ Regular security audits

---

## TROUBLESHOOTING

### Common Issues

#### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
psql -U postgres

# Check connection parameters
nc -z localhost 5432

# Reset password
psql -U postgres -c "ALTER USER painrelief_user WITH PASSWORD 'new_password';"
```

#### JWT Token Invalid
- Check JWT_SECRET matches between backend and frontend
- Verify token hasn't expired
- Check Authorization header format: "Bearer <token>"

#### CORS Errors
- Verify FRONTEND_URL in backend matches actual frontend URL
- Check that CORS middleware is before route handlers
- Verify credentials: true is set if needed

#### Out of Memory
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm start

# Or use PM2 watch
pm2 start server.js --max-memory-restart 500M
```

#### Database Too Slow
```bash
# Check slow queries
SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

# Create indexes
CREATE INDEX idx_name ON table(column);

# Analyze and vacuum
ANALYZE;
VACUUM ANALYZE;
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run dev

# Or in code
console.log('Debug:', variable);

# Using debugger
node inspect server.js
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache exercise list
app.get('/api/exercises', async (req, res) => {
  const cached = await client.get('exercises');
  if (cached) return res.json(JSON.parse(cached));
  
  const exercises = await fetchExercises();
  await client.setEx('exercises', 3600, JSON.stringify(exercises));
  res.json(exercises);
});
```

### Database Query Optimization
```javascript
// Use connection pooling
const pool = new Pool({ max: 20, min: 5 });

// Batch inserts
INSERT INTO pain_logs VALUES (...), (...), (...);

// Pagination
SELECT * FROM pain_logs LIMIT 20 OFFSET 0;
```

### Frontend Optimization
- ✓ Code splitting with React.lazy()
- ✓ Image optimization with WebP
- ✓ Service Worker for offline support
- ✓ Minification and compression
- ✓ CDN for static assets

---

## MAINTENANCE & UPDATES

### Weekly Tasks
- ✓ Check error logs
- ✓ Monitor server performance
- ✓ Verify backups completed

### Monthly Tasks
- ✓ Security patching (npm audit)
- ✓ Database optimization
- ✓ Review analytics

### Quarterly Tasks
- ✓ Update dependencies
- ✓ Security audit
- ✓ Capacity planning

---

## NEXT STEPS

1. ✓ Deploy backend to production
2. ✓ Deploy frontend to CDN
3. ✓ Set up monitoring and alerting
4. ✓ Configure automated backups
5. ✓ Plan disaster recovery
6. ✓ Set up CI/CD pipeline
7. ✓ Launch marketing campaign
8. ✓ Collect user feedback
9. ✓ Iterate and improve

---

## SUPPORT & RESOURCES

- API Documentation: http://localhost:5000/api-docs
- GitHub: https://github.com/yourusername/painrelief-ai
- Issues: https://github.com/yourusername/painrelief-ai/issues
- Email: support@painrelief.ai

---

Good luck with your deployment! 🚀
