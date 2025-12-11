# Railway Deployment Guide

## Services
1. **Backend (Node/Express)**
   - Deploy `backend` as a Node service.
   - Start command: `npm start`
   - Install command: `npm install`
2. **Database**
   - Add a MySQL service in Railway.

## Required Environment Variables (Backend)
Set these in Railway project variables for the backend service:
```
PORT=5000
DB_HOST=<railway-mysql-host>
DB_USER=<railway-mysql-user>
DB_PASSWORD=<railway-mysql-password>
DB_NAME=<railway-mysql-database>
```

## Start Command (Procfile already added)
```
web: npm install --prefix backend && npm start --prefix backend
```

## Build Frontend Separately (optional)
If you want a separate Railway Static service:
```
cd frontend
npm install
npm run build
```
Serve the `frontend/build` folder via Railway’s static hosting, or connect it to a CDN.

## Notes
- Ensure MySQL service is created in Railway and credentials are injected via env vars.
- The backend expects the variables above; no code changes required for Railway.
- CORS: frontend should call the deployed backend URL (update `API_URL` in frontend if needed).

