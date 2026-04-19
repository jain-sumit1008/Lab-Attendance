const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET latest lab info
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM lab_info ORDER BY id DESC LIMIT 1",
    (err, result) => {

      if (err) {
        console.log("DB ERROR:", err);   // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });
      }

      res.json(result[0] || {});  // 👈 no crash if empty
    }
  );
});

// POST lab info
router.post("/", (req, res) => {
  const { lab, course, batch, date, time } = req.body;

  const sql = `
    INSERT INTO lab_info (id, lab, course, batch, date, time)
    VALUES (1, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      lab = VALUES(lab),
      course = VALUES(course),
      batch = VALUES(batch),
      date = VALUES(date),
      time = VALUES(time)
  `;

  db.query(sql, [lab, course, batch, date, time], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Lab info saved/updated ✅" });
  });
});
module.exports = router;