# MovieMania - Full-Stack Movie Database Application

MovieMania is a full-stack web application for cinema enthusiasts to manage a database of movies. Built with React.js, Node.js, Express.js, and MySQL.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **API Client**: Axios

## Features

- Full CRUD operations (Create, Read, Update, Delete) for movies
- Search movies by title or genre (case-insensitive)
- View detailed movie information in a modal
- Responsive design with Tailwind CSS
- Review/Feedback form with validation
- Geolocation API integration
- Input sanitization and error handling
- Lazy loading for movie posters

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL installed and running
- npm or yarn

### Database Setup

1. Create the database and tables:
```bash
mysql -u root -p < backend/database.sql
```

Or manually:
```sql
CREATE DATABASE moviemania_db;
USE moviemania_db;
SOURCE backend/database.sql;
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=moviemania_db
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/movies` - Fetch all movies
- `GET /api/movies/:id` - Fetch a single movie by ID
- `POST /api/movies` - Add a new movie
- `PUT /api/movies/:id` - Update a movie by ID
- `DELETE /api/movies/:id` - Delete a movie by ID
- `POST /api/reviews` - Submit a review
- `GET /api/health` - Health check

## Database Schema

```sql
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    poster_url VARCHAR(255) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Project Structure

```
moviemania/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── database.sql       # Database schema and sample data
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Usage

1. **View Movies**: Home page displays all movies in a grid
2. **Search**: Use search bar to filter by title or genre
3. **Add Movie**: Click "Add Movie" to add new movies
4. **View Details**: Click "View" on any movie card
5. **Edit Movie**: Click "Edit" in movie details modal
6. **Delete Movie**: Click "Delete" button
7. **Submit Review**: Navigate to "Reviews" page

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running: `sudo service mysql start` (Linux) or check MySQL service (Windows)
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check credentials in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using the port

### CORS Errors
- Ensure backend is running before frontend
- Check backend URL matches frontend API_URL

## License

This project is created for educational purposes.
