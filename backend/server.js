import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost',
  credentials: true,
  optionsSuccessStatus: 200,
}));

const csrfProtection = csrf({ cookie: true });

// Database connection
const connection = new sqlite3.Database('./db/aplikasi.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Middleware to log errors to server
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);  // Log the error details on the server side

  // Send a generic error message to the client
  res.status(500).json({
    message: 'An internal server error occurred. Please try again later.',
  });
};

// Get user by ID
app.get('/api/user/:id', (req, res, next) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const userId = req.params.id;

  connection.all(query, [userId], (error, results) => {
    if (error) {
      return next(error);
    }
    res.json(results);
  });
});

// Get CSRF token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Change user email with CSRF protection
app.post('/api/user/:id/change-email', csrfProtection, (req, res, next) => {
  const newEmail = req.body.email;
  const userId = req.params.id;

  if (!newEmail || typeof newEmail !== 'string') {
    return res.status(400).json({ message: 'Invalid email provided' });
  }
  const query = 'UPDATE users SET email = ? WHERE id = ?';

  connection.run(query, [newEmail, userId], function (err) {
    if (err) {
      return next(err);
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Email updated successfully' });
  });
});

// File handling
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "files", req.query.name);
  if (!filePath.startsWith(path.join(__dirname, "files"))) {
    return res.status(403).send("Access denied");
  }
  res.sendFile(filePath);
});

// Catch-all route for undefined API endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Apply the error handler middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
