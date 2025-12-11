const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefer explicit DB_* variables; fall back to Railway's injected MYSQL* if not set
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'root',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'moviemania_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
    seedDatabase();
  })
  .catch(error => {
    console.error('MySQL connection error:', error.message);
    console.log('Please make sure MySQL is running and database exists');
    console.log('Run: mysql -u root -p < database.sql');
  });

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
}

async function seedDatabase() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM movies');
    if (rows[0].count === 0) {
      const sampleMovies = [
        ['Sholay: The Final Cut', 'Action', 'Classic action drama.', 'https://i.imgur.com/5J9xZkU.jpeg', 0.0, 'U', 'Hindi', 0, 8200],
        ['Dhurandhar', 'Action', 'Intense action feature.', 'https://i.imgur.com/5rC4x7c.jpeg', 9.2, 'A', 'Hindi', 88300, 0],
        ['Akhanda 2: Thaandavam', 'Action', 'Epic sequel with high stakes.', 'https://i.imgur.com/5oXbL1C.jpeg', 0.0, 'UA16+', 'Telugu, Hindi, Tamil, Kannada', 0, 341000],
        ['Kis Kisko Pyaar Karoon 2', 'Comedy', 'Lighthearted comedy sequel.', 'https://i.imgur.com/O5kxZll.jpeg', 0.0, 'UA16+', 'Hindi', 0, 47200],
        ['Padayappa', 'Drama', 'Revenge and redemption.', 'https://i.imgur.com/XV4SWBk.jpeg', 0.0, 'U', 'Tamil', 0, 0],
        ['The Devil', 'Action', 'Stylish action thriller.', 'https://i.imgur.com/1Yk1zOG.jpeg', 0.0, 'UA16+', 'Kannada', 195000, 0],
        ['Avatar: Fire and Ash', 'Fantasy', 'Mythic fantasy adventure.', 'https://i.imgur.com/uzXo8Kb.jpeg', 0.0, 'UA16+', 'English, Kannada, Malayalam, Telugu', 1300000, 0],
        ['Zootopia 2', 'Family', 'Animated adventure sequel.', 'https://i.imgur.com/9kxHykG.jpeg', 9.1, 'UA7+', 'English, Hindi, Tamil, Telugu', 11300, 0],
        ['Tere Ishk Mein', 'Drama', 'Romantic drama.', 'https://i.imgur.com/VLVuOxY.jpeg', 8.3, 'UA16+', 'Hindi, Tamil', 68800, 0],
        ['Kalamkaval', 'Thriller', 'Malayalam thriller.', 'https://i.imgur.com/1n8GyQw.jpeg', 8.7, 'UA16+', 'Malayalam', 35800, 0],
        ['Eko', 'Drama', 'Emotional family drama.', 'https://i.imgur.com/yQJeNEB.jpeg', 9.2, 'UA16+', 'Malayalam', 40400, 0],
        ['Vaa Vaathiyaar', 'Action', 'Action-packed entertainer.', 'https://i.imgur.com/NYNW8Iy.jpeg', 0.0, 'UA7+', 'Tamil', 13600, 0],
        ['Kantara: A Legend Chapter-1', 'Action', 'Mythic action prequel.', 'https://i.imgur.com/96jUf3E.jpeg', 9.3, 'UA16+', 'Kannada, Telugu, Hindi, Tamil', 561000, 0],
        ['Acharya Sri Shankara', 'Drama', 'Spiritual historical drama.', 'https://i.imgur.com/njbwAFB.jpeg', 9.0, 'U', 'Kannada', 0, 0],
        ['The Girlfriend', 'Thriller', 'Suspenseful relationship thriller.', 'https://i.imgur.com/8n8m3W8.jpeg', 8.6, 'UA13+', 'Telugu, Hindi, Tamil, Kannada', 21500, 0],
        ['Vishwaroopini Sri Vasavi', 'Drama', 'Epic biographical drama.', 'https://i.imgur.com/1dq6G6C.jpeg', 9.4, 'U', 'Kannada', 30, 0]
      ];

      const query = 'INSERT INTO movies (title, genre, description, poster_url, rating, certificate, language, votes, likes) VALUES ?';
      await pool.query(query, [sampleMovies]);
      console.log('Sample movies seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

app.get('/api/movies', async (req, res) => {
  try {
    const [movies] = await pool.execute(
      'SELECT * FROM movies ORDER BY created_at DESC'
    );
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies', message: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const [movies] = await pool.execute(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );
    
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movies[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie', message: error.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, genre, description, poster_url, rating, certificate, language, votes, likes } = req.body;
    
    if (!title || !genre || !description || !poster_url || rating === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedGenre = sanitizeInput(genre);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedPosterUrl = sanitizeInput(poster_url);
    const numRating = parseFloat(rating);
    const sanitizedCertificate = sanitizeInput(certificate || 'UA');
    const sanitizedLanguage = sanitizeInput(language || '');
    const numVotes = votes !== undefined ? parseInt(votes, 10) : 0;
    const numLikes = likes !== undefined ? parseInt(likes, 10) : 0;

    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      return res.status(400).json({ error: 'Rating must be a number between 0 and 10' });
    }
    if (isNaN(numVotes) || numVotes < 0) {
      return res.status(400).json({ error: 'Votes must be a non-negative number' });
    }
    if (isNaN(numLikes) || numLikes < 0) {
      return res.status(400).json({ error: 'Likes must be a non-negative number' });
    }

    const [result] = await pool.execute(
      'INSERT INTO movies (title, genre, description, poster_url, rating, certificate, language, votes, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sanitizedTitle, sanitizedGenre, sanitizedDescription, sanitizedPosterUrl, numRating, sanitizedCertificate, sanitizedLanguage, numVotes, numLikes]
    );

    const [newMovie] = await pool.execute(
      'SELECT * FROM movies WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newMovie[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create movie', message: error.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const { title, genre, description, poster_url, rating, certificate, language, votes, likes } = req.body;
    
    const updates = [];
    const values = [];

    if (title) {
      updates.push('title = ?');
      values.push(sanitizeInput(title));
    }
    if (genre) {
      updates.push('genre = ?');
      values.push(sanitizeInput(genre));
    }
    if (description) {
      updates.push('description = ?');
      values.push(sanitizeInput(description));
    }
    if (poster_url) {
      updates.push('poster_url = ?');
      values.push(sanitizeInput(poster_url));
    }
    if (rating !== undefined) {
      const numRating = parseFloat(rating);
      if (isNaN(numRating) || numRating < 0 || numRating > 10) {
        return res.status(400).json({ error: 'Rating must be a number between 0 and 10' });
      }
      updates.push('rating = ?');
      values.push(numRating);
    }
    if (certificate) {
      updates.push('certificate = ?');
      values.push(sanitizeInput(certificate));
    }
    if (language) {
      updates.push('language = ?');
      values.push(sanitizeInput(language));
    }
    if (votes !== undefined) {
      const numVotes = parseInt(votes, 10);
      if (isNaN(numVotes) || numVotes < 0) {
        return res.status(400).json({ error: 'Votes must be a non-negative number' });
      }
      updates.push('votes = ?');
      values.push(numVotes);
    }
    if (likes !== undefined) {
      const numLikes = parseInt(likes, 10);
      if (isNaN(numLikes) || numLikes < 0) {
        return res.status(400).json({ error: 'Likes must be a non-negative number' });
      }
      updates.push('likes = ?');
      values.push(numLikes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);

    const [result] = await pool.execute(
      `UPDATE movies SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const [updatedMovie] = await pool.execute(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedMovie[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie', message: error.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const [movie] = await pool.execute(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (movie.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await pool.execute('DELETE FROM movies WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Movie deleted successfully', movie: movie[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie', message: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { userName, email, movieTitle, rating } = req.body;
    console.log('Review submitted:', { userName, email, movieTitle, rating });
    res.json({ message: 'Review submitted successfully', review: { userName, email, movieTitle, rating } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review', message: error.message });
  }
});

app.get('/api/movies/search/external', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Title parameter is required' });
    }
    
    res.json({
      message: 'External API integration ready',
      note: 'To enable external movie data fetching, add your API key and integrate with OMDB or TMDB API',
      searchTerm: title
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch external movie data', message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
