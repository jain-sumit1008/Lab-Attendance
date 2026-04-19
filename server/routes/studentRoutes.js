const express = require("express");
const router = express.Router();   // ✅ THIS LINE WAS MISSING
const db = require("../config/db");

// ✅ Get all students
router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ Get students by batch
router.get("/batch/:batch", (req, res) => {
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