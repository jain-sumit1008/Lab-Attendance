const express = require("express");
const router = express.Router();   
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
// ✅ Get all students
router.get("/",authMiddleware, (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ Get students by batch
router.get("/batch/:batch",authMiddleware, (req, res) => {
  const { batch } = req.params;

  const sql = `
    SELECT * FROM students
    WHERE batch = ?
  `;

  db.query(sql, [batch], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;   // ✅ ALSO REQUIRED