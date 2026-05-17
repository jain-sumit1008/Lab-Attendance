const db = require("../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// =============================
// STUDENT REGISTER
// =============================
exports.registerStudent = async (req, res) => {

   const {
      enrollment_no,
      name,
      branch,
      class: studentClass,
      system_type,
      email,
      password
   } = req.body;

   try {

      const hashedPassword =
         await bcrypt.hash(password, 10);

      const sql = `
         INSERT INTO students
         (
            enrollment_no,
            name,
            branch,
            class,
            system_type,
            email,
            password
         )
         VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
         sql,
         [
            enrollment_no,
            name,
            branch,
            studentClass,
            system_type,
            email,
            hashedPassword
         ],
         (err, result) => {

            if(err) {
               return res.status(500).json(err);
            }

            res.json({
               message: "Student registered successfully"
            });

         }
      );

   } catch(err) {

      res.status(500).json(err);

   }
};


// =============================
// STUDENT LOGIN
// =============================
exports.studentLogin = (req, res) => {

   const {
      enrollment_no,
      password
   } = req.body;

   const sql = `
      SELECT * FROM students
      WHERE enrollment_no = ?
   `;

   db.query(
      sql,
      [enrollment_no],
      async (err, result) => {

         if(err) {
            return res.status(500).json(err);
         }

         if(result.length === 0) {

            return res.status(401).json({
               message: "Invalid credentials"
            });

         }

         const student = result[0];

         const isMatch =
            await bcrypt.compare(
               password,
               student.password
            );

         if(!isMatch) {

            return res.status(401).json({
               message: "Invalid credentials"
            });

         }

         const token = jwt.sign(
            {
               id: student.id,
               role: "student"
            },
            process.env.JWT_SECRET,
            {
               expiresIn: "1d"
            }
         );

         delete student.password;

         res.json({
            token,
            role: "student",
            student
         });

      }
   );
};


// =============================
// ADMIN REGISTER
// =============================
exports.registerAdmin = async (req, res) => {

   const {
      username,
      password
   } = req.body;

   try {

      const hashedPassword =
         await bcrypt.hash(password, 10);

      const sql = `
         INSERT INTO admins
         (username, password)
         VALUES (?, ?)
      `;

      db.query(
         sql,
         [
            username,
            hashedPassword
         ],
         (err, result) => {

            if(err) {
               return res.status(500).json(err);
            }

            res.json({
               message: "Admin registered"
            });

         }
      );

   } catch(err) {

      res.status(500).json(err);

   }
};


// =============================
// ADMIN LOGIN
// =============================
exports.adminLogin = (req, res) => {

   const {
      username,
      password
   } = req.body;

   const sql = `
      SELECT * FROM admins
      WHERE username = ?
   `;

   db.query(
      sql,
      [username],
      async (err, result) => {

         if(err) {
            return res.status(500).json(err);
         }

         if(result.length === 0) {

            return res.status(401).json({
               message: "Invalid credentials"
            });

         }

         const admin = result[0];

         const isMatch =
            await bcrypt.compare(
               password,
               admin.password
            );

         if(!isMatch) {

            return res.status(401).json({
               message: "Invalid credentials"
            });

         }

         const token = jwt.sign(
            {
               id: admin.id,
               role: "admin"
            },
            process.env.JWT_SECRET,
            {
               expiresIn: "1d"
            }
         );

         delete admin.password;

         res.json({
            token,
            role: "admin",
            admin
         });

      }
   );
};


// =============================
// VERIFY TOKEN
// =============================
exports.verifyUser = (req, res) => {

   res.json({
      valid: true,
      user: req.user
   });

};