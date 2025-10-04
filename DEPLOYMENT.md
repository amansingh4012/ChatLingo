# 🚀 ChatLingo Deployment Guide - Render

Simple deployment guide for ChatLingo on Render platform.

## 📋 Prerequisites

- **GitHub repository** with your code
- **MongoDB Atlas** account 
- **Stream.io** account
- **Render** account

## 🔧 Environment Variables Setup

Get these values ready:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET_KEY` - Random secret key (long and complex)
- `STREAM_API_KEY` - From Stream.io dashboard
- `STREAM_API_SECRET` - From Stream.io dashboard

## 🚀 Deploy on Render

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository: `amansingh4012/ChatLingo`

### Step 2: Configure Service
- **Name**: `chatlingo-app`
- **Environment**: `Node`
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables
```
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_super_secret_jwt_key_here
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=production
VITE_STREAM_API_KEY=your_stream_api_key
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your app will be live at: `https://your-app-name.onrender.com`

## 🔧 Update CORS (Important!)

After deployment, update your `backend/src/server.js`:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? "https://your-app-name.onrender.com" 
        : "http://localhost:5173",
    credentials: true,
}));
```

Replace `your-app-name` with your actual Render app name, then redeploy.

## ✅ Your Setup is Perfect!

Your project is already configured for simple deployment:
- Root `package.json` handles build and start commands
- Server.js serves frontend static files in production
- No Docker or complex configuration needed

## 🚨 Troubleshooting

**Build fails?** 
- Check all environment variables are set
- Verify MongoDB URI format

**CORS errors?** 
- Update the origin URL in server.js
- Redeploy after changes

**App not loading?**
- Check Render logs for errors
- Verify all dependencies are in package.json

---

**That's it! Your ChatLingo app should now be live on Render! 🎉**