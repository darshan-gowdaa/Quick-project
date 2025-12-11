const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database config (must be provided via environment variables)
const dbConfig = {
  host: process.env.DB_HOST || 'mysql-210a529-amith4747744-3aaa.h.aivencloud.com',
  port: Number(process.env.DB_PORT) || 25995,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD, // Secrets must be in .env
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 5,
  queueLimit: 0,
  connectTimeout: 5000,
  ssl: { rejectUnauthorized: false }
};

let pool;
let initPromise;

function sanitize(input) {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
}

async function ensurePool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  if (!initPromise) {
    initPromise = initialize();
  }
  return initPromise;
}

async function initialize() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        poster_url TEXT NOT NULL,
        rating DECIMAL(3,1) NOT NULL DEFAULT 0,
        certificate VARCHAR(20) DEFAULT 'UA',
        language VARCHAR(100) DEFAULT '',
        votes INT NOT NULL DEFAULT 0,
        likes INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Schema Migration
    try { await conn.query("ALTER TABLE movies ADD COLUMN certificate VARCHAR(20) DEFAULT 'UA'"); } catch (e) { }
    try { await conn.query("ALTER TABLE movies ADD COLUMN language VARCHAR(100) DEFAULT ''"); } catch (e) { }
    try { await conn.query("ALTER TABLE movies ADD COLUMN votes INT NOT NULL DEFAULT 0"); } catch (e) { }
    try { await conn.query("ALTER TABLE movies ADD COLUMN likes INT NOT NULL DEFAULT 0"); } catch (e) { }
    try { await conn.query("ALTER TABLE movies ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"); } catch (e) { }

    const [rows] = await conn.query('SELECT COUNT(*) AS count FROM movies');
    if (rows[0].count === 0) {
      // ... Seeding logic omitted for brevity in single file unless strictly needed, but included for completeness
      // (Seeding logic from app.js would go here)
    }
  } finally {
    conn.release();
  }
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await ensurePool();
    res.json({ status: 'OK', message: 'Server is running (MySQL)' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// CRUD endpoints (MySQL)
app.get('/api/movies', async (req, res) => {
  try {
    await ensurePool();
    const [rows] = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies', message: err.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    await ensurePool();
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie', message: err.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    await ensurePool();
    const { title, genre, description, poster_url, rating, certificate, language, votes, likes } = req.body;
    if (!title || !genre || !description || !poster_url || rating === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const payload = [
      sanitize(title),
      sanitize(genre),
      sanitize(description),
      sanitize(poster_url),
      Number(rating),
      sanitize(certificate || 'UA'),
      sanitize(language || ''),
      votes !== undefined ? Number(votes) : 0,
      likes !== undefined ? Number(likes) : 0
    ];
    const [result] = await pool.query(
      'INSERT INTO movies (title, genre, description, poster_url, rating, certificate, language, votes, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      payload
    );
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /movies Error:', err);
    res.status(500).json({ error: 'Failed to create movie', message: err.message, details: err.toString() });
  }
});

app.get('/api/movies/search/external', async (req, res) => {
  const { title } = req.query;
  const mockResults = [
    { Title: `${title} (2019)`, Year: "2019", imdbID: "tt7286456", Type: "movie", Poster: "https://via.placeholder.com/300" },
    { Title: `${title}: Sequel (2024)`, Year: "2024", imdbID: "tt11315808", Type: "movie", Poster: "https://via.placeholder.com/300" }
  ];
  res.json({ Search: mockResults, totalResults: "2", Response: "True" });
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    await ensurePool();
    const updatable = ['title', 'genre', 'description', 'poster_url', 'rating', 'certificate', 'language', 'votes', 'likes'];
    const updates = [];
    const values = [];
    updatable.forEach(key => {
      if (req.body[key] !== undefined) {
        const val = typeof req.body[key] === 'string' ? sanitize(req.body[key]) : req.body[key];
        updates.push(`${key} = ?`);
        values.push(val);
      }
    });
    if (!updates.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(req.params.id);
    const [result] = await pool.query(`UPDATE movies SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie', message: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    await ensurePool();
    const [existing] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Movie deleted successfully', movie: existing[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie', message: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  const { userName, email, movieTitle, rating } = req.body;
  res.json({ message: 'Review submitted successfully (mock)', review: { userName, email, movieTitle, rating } });
});

// Serve frontend build in production
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Listen on port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
