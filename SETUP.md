# MovieMania Setup Guide

## Step 1: Install MySQL

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run installer and follow setup wizard
3. Remember your root password

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## Step 2: Create Database

Run the SQL script to create database and tables:

```bash
mysql -u root -p < backend/database.sql
```

Or manually in MySQL:
```sql
mysql -u root -p
CREATE DATABASE moviemania_db;
USE moviemania_db;
SOURCE backend/database.sql;
```

Verify tables were created:
```sql
SHOW TABLES;
SELECT * FROM movies;
```

## Step 3: Backend Setup

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

Start backend:
```bash
npm start
```

You should see:
- "Connected to MySQL database"
- "Sample movies seeded successfully"
- "Server is running on port 5000"

## Step 4: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Browser should open to `http://localhost:3000`

## Verification

1. Backend: Visit `http://localhost:5000/api/health`
2. Frontend: Should show MovieMania homepage
3. Database: Check MySQL for 5 sample movies

## Common Issues

### MySQL Access Denied
- Check username/password in `.env`
- Verify MySQL user has permissions:
  ```sql
  GRANT ALL PRIVILEGES ON moviemania_db.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Database Not Found
- Run `database.sql` script again
- Check database name matches `.env` file

### Connection Refused
- Ensure MySQL service is running
- Check MySQL is listening on port 3306
- Verify firewall settings
