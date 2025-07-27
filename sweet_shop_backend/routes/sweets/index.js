const express = require("express");
const db = require("../../db/dbConfig"); // Adjust path as per your project structure
const { authenticateToken, adminCheck } = require("../../middleware/auth");
const router = express.Router();

// List sweets
router.get("/", authenticateToken, (req, res) => {
  const query = "SELECT * FROM sweets";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching sweets:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

// Create a sweet
router.post("/", authenticateToken, (req, res) => {
  const { name, category, price, quantity_in_stock } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  const insertQuery = `
    INSERT INTO sweets (name, category, price, quantity_in_stock)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [name, category || null, price, quantity_in_stock || 0],
    (err, result) => {
      if (err) {
        console.error("Error inserting sweet:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Sweet created successfully",
        sweetId: result.insertId,
      });
    }
  );
});

// Update a sweet
router.put("/:id", authenticateToken, (req, res) => {
  const sweetId = req.params.id;
  const { name, category, price, quantity_in_stock } = req.body;

  const updateQuery = `
    UPDATE sweets
    SET 
      name = ?,
      category = ?,
      price = ?,
      quantity_in_stock = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [name, category, price, quantity_in_stock, sweetId],
    (err, result) => {
      if (err) {
        console.error("Error updating sweet:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      res.json({ message: "Sweet updated successfully" });
    }
  );
});

// Delete a sweet
router.delete("/:id", authenticateToken, adminCheck, (req, res) => {
  const sweetId = req.params.id;

  const deleteQuery = "DELETE FROM sweets WHERE id = ?";

  db.query(deleteQuery, [sweetId], (err, result) => {
    if (err) {
      console.error("Error deleting sweet:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json({ message: "Sweet deleted successfully" });
  });
});

// Search sweet
router.get("/search", authenticateToken, (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM sweets WHERE 1=1";
  const values = [];

  //   Query by name
  if (name) {
    query += " AND name LIKE ?";
    values.push(`%${name}%`);
  }

  //   Query by category
  if (category) {
    query += " AND category = ?";
    values.push(category);
  }

  //   Query by price
  if (minPrice) {
    query += " AND price >= ?";
    values.push(minPrice);
  }

  if (maxPrice) {
    query += " AND price <= ?";
    values.push(maxPrice);
  }

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error fetching sweets:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

module.exports = router;
