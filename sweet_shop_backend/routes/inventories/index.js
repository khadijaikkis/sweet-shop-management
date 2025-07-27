const express = require("express");
const db = require("../../db/dbConfig"); // Adjust path as per your project structure
const { authenticateToken, adminCheck } = require("../../middleware/auth");
const router = express.Router();

// purchase api

router.post("/:id/purchase", authenticateToken, (req, res) => {
  const sweetId = req.params.id;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  db.query(
    "SELECT quantity_in_stock from sweets WHERE id = ?",
    [sweetId],
    (err, result) => {
      if (err) {
        console.error("Error fetching sweet:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      const stock = result[0].quantity_in_stock;
      if (stock < quantity) {
        return res.status(400).json({ message: "Not enough sweets in stock" });
      }

      // Deduct Quantity

      db.query(
        "UPDATE sweets SET quantity_in_stock = quantity_in_stock - ? WHERE id = ?",
        [quantity, sweetId],
        (err2, updateResult) => {
          if (err2) {
            console.error("Error updating stock:", err2);
            return res
              .status(500)
              .json({ message: "Failed to complete purchase" });
          }
        }
      );

      res.json({ message: "Purchase successfull", sweetId, quantity });
    }
  );
});

// restock sweets api

router.post("/:id/restock", authenticateToken, adminCheck, (req, res) => {
  const sweetId = req.params.id;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  db.query(
    "UPDATE sweets SET quantity_in_stock = quantity_in_stock + ? WHERE id = ?",
    [quantity, sweetId],
    (err2, updateResult) => {
      if (err2) {
        console.error("Error updating stock:", err2);
        return res.status(500).json({ message: "Failed to complete purchase" });
      }
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: "Sweet not found" });
      }
    }
  );

  res.json({ message: "Restock successfull", sweetId, quantity });
});

module.exports = router;
