const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db/dbConfig');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, username, password, address, created_by } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    // Check for existing email/username
    db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
      async (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        if (results.length > 0)
          return res.status(400).json({ message: 'Email or username exists' });

        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Insert user
        db.query(
          'INSERT INTO users (email, username, password, address, created_by) VALUES (?, ?, ?, ?, ?)',
          [email, username, hash, address, created_by || username],
          (err) => {
            if (err) return res.status(500).json({ message: 'Insert error' });
            res.status(201).json({ message: 'User registered' });
          }
        );
      }
    );
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
