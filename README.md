# Kasa Real Estate Application

A comprehensive real estate platform built with Node.js/Express and React, featuring user authentication, license management, and role-based access control.

## Table of Contents

- [Project Structure](#project-structure)
- [Server Setup](#server-setup)
- [Development vs Production](#development-vs-production)
- [Running the Application](#running-the-application)
- [Getting OAuth2 Credentials](#getting-oauth2-credentials)


---

## Project Structure

```
ksa2.0/
├── server/                    # Node.js/Express backend
│   ├── server.js             # Main server entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.js # Authentication logic
│   ├── middleware/
│   │   ├── errorHandler.js   # Global error handling
│   │   └── verifyToken.js    # JWT verification middleware
│   ├── models/
│   │   ├── userModel.js
│   │   ├── rolesModel.js
│   │   ├── licensesModel.js
│   │   └── licenseTypesModel.js
│   ├── routes/
│   │   └── authRoutes.js     # Authentication endpoints
│   ├── nodemailer/
│   │   └── emails.js         # Email sending utilities
│   └── utils/
│       ├── checkLicenseExpiration.js
│       ├── generateTokenAndSetCookie.js
│       ├── generateVerificationCode.js
│       └── emailTemplates.js
└── client/                    # React frontend
```

---

## Server Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- pnpm package manager

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create `.env` file in root:**
   ```env
   # Server
   NODE_ENV=development
   PORT=5000

   # Database
   MONGO_URI=mongodb://localhost:27017/kasa

   # JWT
   JWT_SECRET=your-secret-key-here

   # Client
   CLIENT_URL=http://localhost:5173

   # OAuth2 (Gmail)
   OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
   OAUTH_CLIENT_SECRET=your-client-secret
   OAUTH_REFRESH_TOKEN=your-refresh-token

   # SMTP
   SMTP_USER=your-email@gmail.com
   SMTP_FROM_NAME=Kasa Support
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

3. **Start the server:**
   ```bash
   pnpm run server    # Watch mode
   pnpm start         # Production mode
   ```

The server runs on `http://localhost:5000`

---

## Development vs Production

### Environment Detection

The app uses `NODE_ENV` to determine its operating mode

### Development Environment

**Set in `.env`:**
```env
NODE_ENV=development
```

**Characteristics:**
- ✅ CORS enabled for frontend dev server (`http://localhost:5173`)
- ✅ Both server & client run independently
- ✅ Hot module reloading on file changes
- ✅ Detailed error messages & logging
- ✅ No static file serving (handled by Vite)
- ✅ API-only responses on root route

**When to use:**
- Local development
- Testing new features
- Debugging

---

### Production Environment

**Set in `.env`:**
```env
NODE_ENV=production
```

**Characteristics:**
- ❌ CORS disabled (frontend served from same origin)
- ✅ Single unified server (server + client)
- ✅ Static React build files served by Express
- ✅ Optimized React bundle (minified, tree-shaken)
- ✅ SPA fallback routing (all routes → `index.html`)
- ✅ Minimal error details for security

**When to use:**
- Deployment to staging/production
- Performance testing
- Final builds

---

## Running the Application

### Development Mode (Concurrent Server & Client)

Use `concurrently` to run both server and client in watch mode:

```bash
pnpm run dev
```

**What happens:**
1. **Server** starts on `http://localhost:5000` in watch mode
   - Restarts on file changes via `node --watch`
   - Logs: `[0] API is running...`

2. **Client** starts on `http://localhost:5173` in watch mode
   - Vite HMR (Hot Module Replacement) enabled
   - Logs: `[1] VITE v... ready in XXX ms`

3. Both run in parallel in the same terminal
   - Prefix `[0]` = server logs
   - Prefix `[1]` = client logs

**Example output:**
```
[0] Warning: To load an ES module, set "type": "module" in the package.json file...
[0] 
[1]   VITE v5.0.0  ready in 256 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  press h to show help
[0] API is running....
```

**Scripts in `package.json`:**
```json
{
  "scripts": {
    "start": "node server/server.js",
    "server": "node --watch server/server.js",
    "client": "pnpm --prefix client run dev",
    "dev": "concurrently \"pnpm run server\" \"pnpm run client\""
  }
}
```

---

### Production Build & Serve

1. **Build the React frontend:**
   ```bash
   pnpm --prefix client run build
   ```
   - Outputs optimized build to `client/dist/`
   - Sets `NODE_ENV=production` during build

2. **Start server in production mode:**
   ```bash
   NODE_ENV=production pnpm start
   ```
   - Server runs on `http://localhost:5000`
   - Serves bundled React from `client/dist/`
   - Single unified server

3. **Full build & run:**
   ```bash
   pnpm run build
   NODE_ENV=production pnpm start
   ```

---

## Getting OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Gmail API
4. Create OAuth2 credentials (Web application type)
5. Add authorized redirect: `https://developers.google.com/oauthplayground`
6. Go to [OAuth Playground](https://developers.google.com/oauthplayground)
7. Authorize with your Gmail account
8. Copy the generated refresh token

---