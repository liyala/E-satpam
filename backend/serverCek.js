import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "news_portal",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL Database");
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "admin123";

// Middleware auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// ====================== AUTH ROUTES ======================

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const checkUserSql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(checkUserSql, [username, email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(insertSql, [username, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User registered successfully", userId: results.insertId });
    });
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  });
});

// Get profile
app.get("/api/profile", authenticateToken, (req, res) => {
  const sql = "SELECT id, username, email, role, created_at FROM users WHERE id = ?";
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// Get all users (admin only)
app.get("/api/users", authenticateToken, requireAdmin, (req, res) => {
  db.query("SELECT id, username, email, role, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update role (admin only)
app.put("/api/users/:id/role", authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!["admin", "user"].includes(role)) return res.status(400).json({ message: "Invalid role" });

  db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User role updated successfully" });
  });
});

// Dashboards
app.get("/api/admin/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});
app.get("/api/user/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to User Dashboard", user: req.user });
});

// ====================== ARTICLE ROUTES ======================

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add article
app.post("/api/articles", authenticateToken, upload.single("thumbnail"), (req, res) => {
  const { title, content, category } = req.body;
  const thumbnailPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO articles (title, content, thumbnail, category, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, content, thumbnailPath, category, req.user.userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add article" });
    res.json({ message: "Berita berhasil ditambahkan", id: result.insertId, success: true });
  });
});

// Update artikel (hanya pemilik artikel atau admin)
app.put("/api/articles/:id", authenticateToken, upload.single("thumbnail"), (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  let thumbnailPath = null;

  // Cek apakah artikel milik user ini atau admin
  const checkSql = "SELECT * FROM articles WHERE id = ?";
  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch article" });
    if (results.length === 0) return res.status(404).json({ error: "Article not found" });

    const article = results[0];
    if (req.user.role !== "admin" && article.user_id !== req.user.userId) {
      return res.status(403).json({ message: "You are not allowed to update this article" });
    }

    if (req.file) {
      thumbnailPath = `/uploads/${req.file.filename}`;
      if (article.thumbnail) {
        const oldPath = path.join(process.cwd(), article.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const sql = `
      UPDATE articles 
      SET title = ?, content = ?, category = ?, thumbnail = COALESCE(?, thumbnail) 
      WHERE id = ?
    `;
    db.query(sql, [title, content, category, thumbnailPath, id], (err) => {
      if (err) return res.status(500).json({ error: "Failed to update article" });
      res.json({ message: "Berita berhasil diupdate", success: true });
    });
  });
});

// Delete artikel (hanya pemilik artikel atau admin)
app.delete("/api/articles/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const checkSql = "SELECT * FROM articles WHERE id = ?";
  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch article" });
    if (results.length === 0) return res.status(404).json({ error: "Article not found" });

    const article = results[0];
    if (req.user.role !== "admin" && article.user_id !== req.user.userId) {
      return res.status(403).json({ message: "You are not allowed to delete this article" });
    }

    if (article.thumbnail) {
      const fullPath = path.join(process.cwd(), article.thumbnail);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    db.query("DELETE FROM articles WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete article" });
      res.json({ message: "Berita berhasil dihapus", success: true });
    });
  });
});

// Get semua artikel (public bisa lihat juga kalau mau)
app.get("/api/articles", (req, res) => {
  db.query(
    `SELECT a.id, a.title, a.content, a.thumbnail, a.category, a.created_at, u.username AS author 
     FROM articles a 
     JOIN users u ON a.user_id = u.id 
     ORDER BY a.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch articles" });
      const articles = results.map((a) => ({
        ...a,
        thumbnail: a.thumbnail ? `http://localhost:${port}${a.thumbnail}` : null,
      }));
      res.json(articles);
    }
  );
});

// ====================== START SERVER ======================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
