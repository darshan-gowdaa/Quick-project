# Quick Start Guide - MovieMania

## Prerequisites
- Node.js (v14+)
- MySQL installed and running
- npm

## Step 1: Setup MySQL Database

```bash
mysql -u root -p < backend/database.sql
```

Or manually:
```sql
mysql -u root -p
CREATE DATABASE moviemania_db;
USE moviemania_db;
SOURCE backend/database.sql;
```

## Step 2: Configure Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moviemania_db
```

## Step 3: Start Backend

```bash
npm start
```

Should see: "Connected to MySQL database" and "Server is running on port 5000"

## Step 4: Start Frontend

Open new terminal:
```bash
cd frontend
npm install
npm start
```

Browser opens to http://localhost:3000

## Verify

1. Backend: http://localhost:5000/api/health
2. Frontend: Shows MovieMania homepage with 5 movies
3. Database: `SELECT * FROM movies;` shows 5 records

## Troubleshooting

**MySQL Connection Error:**
- Check MySQL is running: `sudo service mysql status`
- Verify credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

**Port Already in Use:**
- Change PORT in `.env` file
- Or stop process using port 5000

**Database Not Found:**
- Run `database.sql` script again
- Check database name matches `.env`
