const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database config (must be provided via environment variables; no secrets in code)
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 5,
  queueLimit: 0,
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

    const [rows] = await conn.query('SELECT COUNT(*) AS count FROM movies');
    if (rows[0].count === 0) {
      const sampleMovies = [
        ['Sholay: The Final Cut', 'Action', 'Classic action drama.', 'https://i.imgur.com/5J9xZkU.jpeg', 8.5, 'U', 'Hindi', 1200, 8200],
        ['Zootopia 2', 'Family', 'Animated adventure sequel.', 'https://i.imgur.com/9kxHykG.jpeg', 9.1, 'UA7+', 'English, Hindi, Tamil, Telugu', 500, 11300]
      ];
      await conn.query(
        'INSERT INTO movies (title, genre, description, poster_url, rating, certificate, language, votes, likes) VALUES ?',
        [sampleMovies]
      );
      console.log('Seeded sample movies into MySQL');
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
    res.status(500).json({ error: 'Failed to create movie', message: err.message });
  }
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

// Serve frontend build in production (for Docker/local)
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

module.exports = app;

