const db = require("../config/db");

// Get all students
exports.getStudents = (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Add student
exports.addStudent = (req, res) => {
    const { enrollment_no, name, branch, class: cls, system_type, email } = req.body;

    const sql = "INSERT INTO students VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [enrollment_no, name, branch, cls, system_type, email], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Student added" });
    });
};

