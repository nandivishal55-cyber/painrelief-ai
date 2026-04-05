# 🚀 PAINRELIEF AI - QUICK START GUIDE

Welcome to PainRelief AI! This guide will get you up and running in minutes.

## 📋 Requirements

- **Node.js**: 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL**: 12 or higher ([Download](https://www.postgresql.org/download/))
- **npm**: Comes with Node.js
- **Anthropic API Key**: Get from [console.anthropic.com](https://console.anthropic.com)
- **Git**: For cloning the repository

## ⚡ 5-Minute Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/painrelief-ai.git
cd painrelief-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add these essential values:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=painrelief_ai
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
JWT_SECRET=your_secret_key_here
```

### 4. Initialize Database
```bash
# First, ensure PostgreSQL is running:
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: PostgreSQL service should be running

npm run db:init
```

### 5. Start Development Servers
```bash
# Terminal 1: Start Backend
npm run dev

# Terminal 2: Start Frontend
npm run dev:frontend

# Or in one terminal:
npm run dev:all
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## 🐳 Docker Setup (Even Easier!)

If you have Docker installed:

```bash
# 1. Create .env file
cp .env.example .env
# Edit .env with your API key

# 2. Start everything with one command
docker-compose up

# 3. Wait for services to start (about 30 seconds)

# 4. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# pgAdmin: http://localhost:5050 (admin@painrelief.ai / admin)
# Adminer: http://localhost:8080

# Stop everything
docker-compose down
```

## 🧪 Test the Application

### 1. Create a Test Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 3. Chat with AI Doctor
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "I have knee pain",
    "language": "en"
  }'
```

### 4. Log Pain Level
```bash
curl -X POST http://localhost:5000/api/pain/log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "level": 7,
    "type": "knee",
    "notes": "Pain while walking"
  }'
```

## 📚 Project Structure

```
painrelief-ai/
├── app.jsx                 # Complete React frontend (all-in-one file)
├── server.js              # Express backend API
├── database_schema.sql    # PostgreSQL schema
├── Dockerfile             # For containerization
├── docker-compose.yml     # Docker setup
├── package.json           # Dependencies
├── .env.example          # Environment template
├── README.md             # Full documentation
├── DEPLOYMENT_GUIDE.md   # Production deployment
└── this file (QUICK_START.md)
```

## 🔑 Important Files to Customize

### 1. Frontend Branding (app.jsx)
Search for and update:
- Company name: `PainRelief AI`
- Logo/colors
- Contact information
- Features description

### 2. Backend Configuration (server.js)
- Add email service configuration
- Configure payment gateway
- Set up analytics
- Add additional AI features

### 3. Database (.env)
- Database credentials
- API keys
- Secrets

## 🚀 Building for Production

### Step 1: Build Frontend
```bash
npm run build
```

### Step 2: Set Environment for Production
```bash
NODE_ENV=production
# Set all production values in .env
```

### Step 3: Start Production Server
```bash
npm start
```

### Step 4: Use Docker for Deployment
```bash
docker build -t painrelief-ai .
docker run -p 5000:5000 painrelief-ai
```

## 📖 Learning Resources

- **API Documentation**: Check `http://localhost:5000/api-docs` (requires setup)
- **Database Schema**: See `database_schema.sql` for complete DB structure
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for production setup
- **Claude API**: https://docs.anthropic.com/
- **React**: https://react.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/

## 🐛 Troubleshooting

### Issue: "Cannot find module"
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: "PostgreSQL connection failed"
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database
npm run db:reset
```

### Issue: "ANTHROPIC_API_KEY not found"
- Make sure `.env` file exists
- Check that `ANTHROPIC_API_KEY` is set correctly
- No spaces around the `=` sign

### Issue: "Port 5000 already in use"
```bash
# Change port in .env
PORT=5001

# Or kill the process using the port
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### Issue: "Vite port already in use"
```bash
# Either use a different port or kill the process
lsof -ti:5173 | xargs kill -9
```

## 📝 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `painrelief_ai` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-...` |
| `JWT_SECRET` | Authentication secret | `your_secret_key` |

## 🔒 Security Checklist

Before deploying to production:
- [ ] Change all default passwords
- [ ] Generate a strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Backup database regularly
- [ ] Use environment-specific secrets
- [ ] Review security headers
- [ ] Set up automated backups

## 📊 Database Management

### Using pgAdmin (Web UI)
```bash
# In docker-compose (included)
# Access: http://localhost:5050
# Login: admin@painrelief.ai / admin
```

### Using Command Line
```bash
# Connect to database
psql -U postgres -d painrelief_ai

# Useful commands:
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM users;  # Query users
```

### Backup Database
```bash
npm run db:backup
# File saved to: backups/painrelief_ai_YYYYMMDD_HHMMSS.sql
```

## 🎯 Next Steps

1. ✅ Complete the setup above
2. ✅ Test by creating a user account in the UI
3. ✅ Try the AI chat feature
4. ✅ Log some pain levels
5. ✅ View the dashboard
6. ✅ Customize branding (colors, text)
7. ✅ Add your own content/features
8. ✅ Deploy to production

## 🤔 Common Questions

**Q: Can I use SQLite instead of PostgreSQL?**
A: Yes, but PostgreSQL is recommended for production.

**Q: Do I need all the optional services (Redis, etc.)?**
A: No, they're optional. Start with just PostgreSQL.

**Q: How do I get an Anthropic API key?**
A: Sign up at https://console.anthropic.com and create an API key.

**Q: Can I modify the React components?**
A: Yes! The entire app.jsx file is editable. Make changes and hot-reload will update.

**Q: How do I add a new feature?**
A: 
1. Add backend endpoint in server.js
2. Add database schema if needed
3. Add frontend component in app.jsx
4. Test and deploy

## 📞 Support & Help

- **Documentation**: See README.md and DEPLOYMENT_GUIDE.md
- **Issues**: github.com/yourusername/painrelief-ai/issues
- **Email**: support@painrelief.ai

## 🎉 You're Ready!

Your PainRelief AI application is now running. Start building!

```
Happy coding! 🚀
```

---

**Need help?** Check the [Full README](./README.md) or [Deployment Guide](./DEPLOYMENT_GUIDE.md)
