
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'news_portal'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed: ', err);
    return;
  }
  console.log('Connected to MySQL Database');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "admin123";

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware untuk check role admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const checkUserSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkUserSql, [username, email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [username, email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ 
          message: 'User registered successfully',
          userId: results.insertId 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Get current user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const sql = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const sql = 'SELECT id, username, email, role, created_at FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Update user role (admin only)
app.put('/api/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const sql = 'UPDATE users SET role = ? WHERE id = ?';
  db.query(sql, [role, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully' });
  });
});

// Protected route example
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  res.json({ 
    message: 'Welcome to Admin Dashboard',
    user: req.user 
  });
});

app.get('/api/user/dashboard', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Welcome to User Dashboard',
    user: req.user 
  });
});
  // section berita disini
   






app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});