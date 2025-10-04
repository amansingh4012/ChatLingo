# 🚀 ChatLingo Deployment Guide

This guide covers various deployment options for the ChatLingo application, from local development to production deployment on different platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** for version control
- **MongoDB Atlas** account or local MongoDB
- **Stream.io** account for chat and video services

## 🔧 Environment Configuration

### Required Environment Variables

#### Backend (.env)
```bash
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatlingo
JWT_SECRET_KEY=your_super_secret_jwt_key_here_make_it_long_and_complex
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here
NODE_ENV=production
```

#### Frontend (.env)
```bash
VITE_STREAM_API_KEY=your_stream_api_key_here
```

### Setting Up External Services

#### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist your IP address (or 0.0.0.0/0 for all IPs in production)
5. Get your connection string
6. Replace `<username>`, `<password>`, and `<cluster>` in your MONGO_URI

#### 2. Stream.io Setup
1. Go to [Stream.io](https://getstream.io/)
2. Create a free account
3. Create a new app
4. Get your API Key and Secret from the dashboard
5. Add them to your environment variables

## 🏠 Local Development Deployment

### Option 1: Development Mode

1. **Clone and setup:**
```bash
git clone https://github.com/amansingh4012/ChatLingo.git
cd ChatLingo
```

2. **Install dependencies:**
```bash
npm run build
```

3. **Configure environment variables:**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your actual values

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your actual values
```

4. **Start development servers:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

### Option 2: Production Mode (Local)

1. **Build the application:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

3. **Access the application:**
- Full app: http://localhost:5001

## ☁️ Cloud Deployment Options

### 1. Vercel Deployment (Recommended for Full-Stack)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Prepare for deployment:**
```bash
# Add vercel.json to root directory
```

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **Deploy to Vercel:**
```bash
npx vercel
```

3. **Configure environment variables in Vercel dashboard:**
- Go to your project settings
- Add all required environment variables
- Redeploy the application

#### Environment Variables for Vercel
Add these in the Vercel dashboard:
- `MONGO_URI`
- `JWT_SECRET_KEY`
- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `NODE_ENV=production`
- `VITE_STREAM_API_KEY`

### 2. Netlify Deployment (Frontend Only)

#### Deploy Frontend to Netlify

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

3. **Configure environment variables:**
- Go to Site settings > Environment variables
- Add `VITE_STREAM_API_KEY`

#### Deploy Backend Separately
For the backend, use Railway, Render, or Heroku (see sections below).

### 3. Railway Deployment (Backend)

#### Steps

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and initialize:**
```bash
railway login
railway init
```

3. **Deploy:**
```bash
cd backend
railway up
```

4. **Configure environment variables:**
```bash
railway variables set MONGO_URI="your_mongo_uri"
railway variables set JWT_SECRET_KEY="your_jwt_secret"
railway variables set STREAM_API_KEY="your_stream_key"
railway variables set STREAM_API_SECRET="your_stream_secret"
railway variables set NODE_ENV="production"
```

### 4. Render Deployment

#### Backend Deployment

1. **Connect GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: Leave empty

4. **Add environment variables:**
   - `MONGO_URI`
   - `JWT_SECRET_KEY`
   - `STREAM_API_KEY`
   - `STREAM_API_SECRET`
   - `NODE_ENV=production`

#### Frontend Deployment

1. **Create a new Static Site**
2. **Configure build settings:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

3. **Add environment variables:**
   - `VITE_STREAM_API_KEY`

### 5. Heroku Deployment

#### Prerequisites
- Heroku account and CLI

#### Steps

1. **Login to Heroku:**
```bash
heroku login
```

2. **Create Heroku apps:**
```bash
# For full-stack deployment
heroku create your-app-name

# Or separate apps for frontend and backend
heroku create your-app-backend
heroku create your-app-frontend
```

3. **Configure buildpacks (for full-stack):**
```bash
heroku buildpacks:add heroku/nodejs
```

4. **Add environment variables:**
```bash
heroku config:set MONGO_URI="your_mongo_uri"
heroku config:set JWT_SECRET_KEY="your_jwt_secret"
heroku config:set STREAM_API_KEY="your_stream_key"
heroku config:set STREAM_API_SECRET="your_stream_secret"
heroku config:set NODE_ENV="production"
heroku config:set VITE_STREAM_API_KEY="your_stream_key"
```

5. **Create Procfile:**
```bash
echo "web: npm start" > Procfile
```

6. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 6. DigitalOcean App Platform

#### Steps

1. **Create new app on DigitalOcean**
2. **Connect GitHub repository**
3. **Configure components:**

**Backend Component:**
- Type: Web Service
- Source Directory: `/backend`
- Build Command: `npm install`
- Run Command: `npm start`

**Frontend Component:**
- Type: Static Site
- Source Directory: `/frontend`
- Build Command: `npm install && npm run build`
- Output Directory: `dist`

4. **Add environment variables for each component**

## 🐳 Docker Deployment

### Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - STREAM_API_KEY=${STREAM_API_KEY}
      - STREAM_API_SECRET=${STREAM_API_SECRET}
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_STREAM_API_KEY=${VITE_STREAM_API_KEY}

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deploy with Docker

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

## 🔐 Security Configuration

### Production Security Checklist

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique JWT secrets
   - Rotate API keys regularly

2. **CORS Configuration:**
   - Update CORS origin to your production domain
   - Remove `localhost` origins in production

3. **Cookie Settings:**
   - Ensure `secure: true` for HTTPS
   - Configure proper `sameSite` settings

4. **Database Security:**
   - Use MongoDB Atlas with IP whitelisting
   - Enable authentication and authorization
   - Regular backups

5. **API Rate Limiting:**
   - Implement rate limiting middleware
   - Monitor for suspicious activity

### Example Production CORS Update

In `backend/src/server.js`:
```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? "https://your-production-domain.com"
        : "http://localhost:5173",
    credentials: true,
}));
```

## 📊 Performance Optimization

### Frontend Optimization

1. **Build optimization:**
```bash
# Enable production optimizations
npm run build
```

2. **Bundle analysis:**
```bash
# Add to package.json scripts
"analyze": "vite-bundle-analyzer dist"
```

### Backend Optimization

1. **Enable gzip compression:**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Implement caching:**
```javascript
import redis from 'redis';
// Add Redis caching layer
```

## 🔍 Monitoring and Logging

### Application Monitoring

1. **Add logging middleware:**
```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

2. **Error tracking:**
   - Integrate Sentry for error monitoring
   - Set up alerts for critical errors

3. **Performance monitoring:**
   - Use New Relic or similar APM tools
   - Monitor database query performance

### Health Checks

Add health check endpoint:
```javascript
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check origin configuration
   - Verify credentials setting

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names and values

3. **Database Connection:**
   - Verify MongoDB URI format
   - Check network connectivity
   - Validate credentials

4. **Stream.io Issues:**
   - Verify API key and secret
   - Check Stream.io dashboard for errors
   - Ensure proper user creation

### Debug Commands

```bash
# Check environment variables
npm run debug:env

# Test database connection
npm run test:db

# Verify API endpoints
curl -X GET http://localhost:5001/health
```

## 📝 Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster set up
- [ ] Stream.io account configured
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate obtained

### Post-deployment
- [ ] Health check endpoint responding
- [ ] Database connectivity verified
- [ ] Stream.io integration working
- [ ] Frontend-backend communication established
- [ ] User registration/login functional
- [ ] Chat and video features operational

### Production Readiness
- [ ] Error monitoring set up
- [ ] Performance monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Logging configured

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm run build
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
```

## 📞 Support

If you encounter deployment issues:

1. Check the troubleshooting section
2. Review platform-specific documentation
3. Create an issue in the GitHub repository
4. Join our community discussions

---

**Happy Deploying! 🚀**