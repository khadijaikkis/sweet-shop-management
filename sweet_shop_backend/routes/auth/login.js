const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db/dbConfig");
const router = express.Router();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Required fields missing" });

  try {
    // Fetch user by email or username
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (results.length === 0)
          return res.status(400).json({ message: "User not found" });

        const user = results[0];

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match)
          return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, username: user.username, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: "4h" }
        );

        res.json({ message: "Login successful", token });
      }
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
