const db = require("../config/db");

// ✅ STUDENT LOGIN
exports.studentLogin = (req, res) => {
  const { enrollment_no, password } = req.body;

  const sql = `
    SELECT * FROM students 
    WHERE enrollment_no = ? AND password = ?
  `;

  db.query(sql, [enrollment_no, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ student: result[0] });
  });
};

// ✅ ADMIN LOGIN
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT * FROM admins 
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ admin: result[0] });
  });
};