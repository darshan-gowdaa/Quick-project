# MovieMania Verification Checklist

Use this checklist to verify everything works correctly.

## ✅ Pre-Startup Checks

- [ ] MongoDB is installed
- [ ] MongoDB is running (check with `mongod` or MongoDB service)
- [ ] Node.js is installed (v14+)
- [ ] npm is installed

## ✅ Backend Setup

- [ ] Navigate to `backend` directory
- [ ] Run `npm install` (should complete without errors)
- [ ] Create `.env` file with:
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/moviemania_db
  ```
- [ ] Run `npm start`
- [ ] See message: "Server is running on port 5000"
- [ ] See message: "Connected to MongoDB"
- [ ] See message: "Sample movies seeded successfully" (first time only)

## ✅ Frontend Setup

- [ ] Navigate to `frontend` directory
- [ ] Run `npm install` (should complete without errors)
- [ ] Run `npm start`
- [ ] Browser opens to `http://localhost:3000`
- [ ] No console errors in browser

## ✅ Backend API Tests

Test these endpoints (use browser, Postman, or curl):

- [ ] `GET http://localhost:5000/api/health`
  - Expected: `{"status":"OK","message":"Server is running"}`

- [ ] `GET http://localhost:5000/api/movies`
  - Expected: Array of 5 movies (or more if you added some)

- [ ] `GET http://localhost:5000/api/movies/{id}`
  - Expected: Single movie object

- [ ] `POST http://localhost:5000/api/movies`
  - Body: `{"title":"Test","genre":"Action","description":"Test desc","poster_url":"https://via.placeholder.com/300","rating":8.5}`
  - Expected: Created movie object

- [ ] `PUT http://localhost:5000/api/movies/{id}`
  - Body: `{"title":"Updated Title"}`
  - Expected: Updated movie object

- [ ] `DELETE http://localhost:5000/api/movies/{id}`
  - Expected: `{"message":"Movie deleted successfully",...}`

## ✅ Frontend Features

### Home Page
- [ ] Hero section displays "MovieMania: Dive into Cinematic Worlds"
- [ ] Featured movies carousel shows 4 placeholder items
- [ ] Search bar is visible and functional
- [ ] Movie grid displays all movies (5 sample movies)
- [ ] Each movie card shows:
  - [ ] Poster image
  - [ ] Title
  - [ ] Genre
  - [ ] Rating badge
  - [ ] Description snippet
  - [ ] View, Edit, Delete buttons

### Search Functionality
- [ ] Type movie title → filters correctly
- [ ] Type genre → filters correctly
- [ ] Case-insensitive search works
- [ ] Empty search shows all movies

### Movie Details Modal
- [ ] Click "View" button → modal opens
- [ ] Modal shows:
  - [ ] Large poster image
  - [ ] Full title
  - [ ] Genre
  - [ ] Rating
  - [ ] Full description
- [ ] Click "Edit" → form appears
- [ ] Edit form fields are pre-filled
- [ ] Update movie → changes save
- [ ] Click "Delete" → confirmation → movie deleted
- [ ] Click "X" → modal closes

### Add Movie Page
- [ ] Navigate to "Add Movie" from nav
- [ ] Form displays all fields:
  - [ ] Title (with "Fetch External Data" button)
  - [ ] Genre
  - [ ] Description
  - [ ] Poster URL
  - [ ] Rating
- [ ] Fill form and submit → movie added
- [ ] Success message appears
- [ ] Redirects to home page
- [ ] New movie appears in grid

### Reviews Page
- [ ] Navigate to "Reviews" from nav
- [ ] Geolocation section displays:
  - [ ] Location request prompt (if not granted)
  - [ ] Latitude/Longitude (if granted)
  - [ ] Bengaluru theaters list
- [ ] Review form displays:
  - [ ] Name field
  - [ ] Email field
  - [ ] Movie Title field
  - [ ] Rating field (1-10)
- [ ] Form validation works:
  - [ ] Empty fields show errors
  - [ ] Invalid email shows error
  - [ ] Rating outside 1-10 shows error
- [ ] Submit review → success message
- [ ] Check backend console → review logged

## ✅ Responsive Design

Test on different screen sizes:

- [ ] Mobile (< 640px):
  - [ ] Navigation collapses appropriately
  - [ ] Movie grid shows 1 column
  - [ ] Forms are readable
  - [ ] Modal is full-width

- [ ] Tablet (640px - 1024px):
  - [ ] Movie grid shows 2-3 columns
  - [ ] Layout adapts properly

- [ ] Desktop (> 1024px):
  - [ ] Movie grid shows 4 columns
  - [ ] Full navigation visible
  - [ ] Optimal spacing

## ✅ Error Handling

- [ ] Backend not running → Frontend shows error message
- [ ] Invalid movie ID → 404 error handled
- [ ] Network error → User-friendly error displayed
- [ ] Invalid form data → Validation errors shown
- [ ] Broken image URLs → Placeholder image shows

## ✅ Performance

- [ ] Images lazy load (check Network tab)
- [ ] No console errors
- [ ] Smooth transitions and animations
- [ ] Fast page loads

## ✅ Code Quality

- [ ] No linter errors
- [ ] All imports resolved
- [ ] No unused variables
- [ ] Proper error handling throughout

## Common Issues & Solutions

### Issue: MongoDB connection error
**Solution**: Start MongoDB with `mongod` or check MongoDB service

### Issue: Port 5000 already in use
**Solution**: Change PORT in `.env` file

### Issue: CORS errors
**Solution**: Ensure backend is running before frontend

### Issue: Movies not loading
**Solution**: Check backend terminal for errors, verify MongoDB connection

### Issue: Images not displaying
**Solution**: Check poster URLs, some may have CORS restrictions

### Issue: Geolocation not working
**Solution**: Grant browser permission, check HTTPS (some browsers require HTTPS)

## Final Verification

- [ ] All CRUD operations work
- [ ] Search works correctly
- [ ] Forms validate properly
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] All features accessible

## ✅ Everything Works!

If all items are checked, your MovieMania application is fully functional! 🎉

