# How to Start MovieMania

## Prerequisites Check
- ✅ Node.js installed (check with: `node --version`)
- ✅ MongoDB installed and running
- ✅ npm installed (comes with Node.js)

## Step 1: Start MongoDB

**Windows:**
- MongoDB should start automatically as a service
- Or run: `mongod` in a terminal
- Check if running: Open MongoDB Compass or check services

**macOS/Linux:**
```bash
mongod
```

## Step 2: Install Backend Dependencies

Open Terminal/PowerShell in the project root:

```bash
cd backend
npm install
```

## Step 3: Start Backend Server

```bash
npm start
```

You should see:
```
Server is running on port 5000
Connected to MongoDB
Sample movies seeded successfully
```

**Keep this terminal open!**

## Step 4: Install Frontend Dependencies

Open a **NEW** Terminal/PowerShell window:

```bash
cd frontend
npm install
```

## Step 5: Start Frontend

```bash
npm start
```

The browser should automatically open to `http://localhost:3000`

**Keep this terminal open too!**

## Verify Everything Works

1. **Backend**: Check `http://localhost:5000/api/health` in browser
   - Should show: `{"status":"OK","message":"Server is running"}`

2. **Frontend**: Should show MovieMania homepage with 5 sample movies

3. **Test Features**:
   - ✅ See movies displayed in grid
   - ✅ Search bar filters movies
   - ✅ Click "View" to see movie details
   - ✅ Click "Add Movie" to add new movie
   - ✅ Click "Reviews" to submit review
   - ✅ Geolocation permission prompt appears

## Troubleshooting

### MongoDB Not Running
```
Error: MongoDB connection error
```
**Solution**: Start MongoDB with `mongod` or check MongoDB service

### Port 5000 Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: 
- Change PORT in `backend/.env` to another port (e.g., 5001)
- Update API_URL in frontend components if needed

### Port 3000 Already in Use
React will automatically use port 3001, 3002, etc.

### Cannot Find Module Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Make sure backend is running BEFORE starting frontend
- Check that backend URL matches `http://localhost:5000`

### Frontend Shows "Failed to fetch movies"
- Verify backend is running on port 5000
- Check browser console for errors
- Verify MongoDB is connected (check backend terminal)

## Quick Test Commands

### Test Backend API
```bash
# Get all movies
curl http://localhost:5000/api/movies

# Health check
curl http://localhost:5000/api/health
```

### Check MongoDB Connection
```bash
# Windows PowerShell
mongosh mongodb://localhost:27017/moviemania_db

# macOS/Linux
mongo mongodb://localhost:27017/moviemania_db
```

## All Set!

Your MovieMania app should now be running! 🎬


