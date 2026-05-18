const db = require("../config/db");
const sendEmail = require("../utils/emailService");

// Mark attendance
exports.markAttendance = (req, res) => {
    const { date, attendance } = req.body;

    const sql = `
        INSERT INTO attendance (enrollment_no, date, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;

    const promises = attendance.map(a => {
        return new Promise((resolve, reject) => {
            db.query(sql, [a.enrollment_no, date, a.status], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(promises)
        .then(() => res.json({ message: "Attendance marked" }))
        .catch(err => res.status(500).json(err));
};

// Get attendance by date
exports.getByDate = (req, res) => {
    const { date } = req.params;

    const sql = `
        SELECT s.enrollment_no, s.name,
        COALESCE(a.status, 'present') as status
        FROM students s
        LEFT JOIN attendance a 
        ON s.enrollment_no = a.enrollment_no AND a.date = ?
        WHERE s.batch = (
            SELECT batch FROM lab_info ORDER BY id DESC LIMIT 1
        )
    `;

    db.query(sql, [date], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Report with percentage
exports.getReport = (req, res) => {

   const sql = `

      SELECT

         s.enrollment_no,
         s.name,
         s.email,

         COUNT(a.id) as total_classes,

         SUM(
            CASE
               WHEN a.status = 'present'
               THEN 1
               ELSE 0
            END
         ) as present_days,

         CASE

            WHEN COUNT(a.id) = 0
            THEN 0

            ELSE (

               SUM(
                  CASE
                     WHEN a.status = 'present'
                     THEN 1
                     ELSE 0
                  END
               ) / COUNT(a.id)

            ) * 100

         END as percentage

      FROM students s

      LEFT JOIN attendance a
      ON s.enrollment_no = a.enrollment_no

      WHERE s.branch = (

         SELECT batch
         FROM lab_info
         ORDER BY id DESC
         LIMIT 1

      )

      GROUP BY s.enrollment_no

   `;

   db.query(sql, (err, result) => {

      if(err) {

         console.log(err);

         return res.status(500).json(err);

      }

      res.json(result);

   });
};
exports.getAttendanceByDate = (req, res) => {

   const { date } = req.params;

   const sql = `

      SELECT

         s.id,
         s.enrollment_no,
         s.name,
         s.email,
         s.branch,

         a.date,
         a.status

      FROM students s

      LEFT JOIN attendance a
      ON s.enrollment_no = a.enrollment_no

      WHERE DATE(a.date) = ?

      AND s.branch = (

         SELECT batch
         FROM lab_info
         ORDER BY id DESC
         LIMIT 1

      )

      ORDER BY s.name ASC

   `;

   db.query(sql, [date], (err, result) => {

      if (err) {

         console.log(err);

         return res.status(500).json({
            success: false,
            message: "Database Error",
            error: err
         });

      }

      res.status(200).json(result);

   });

};

exports.getFilteredReport = (req, res) => {

   const { date, lab, time } = req.query;

   const sql = `

      SELECT

         s.enrollment_no,
         s.name,
         s.email,
         s.branch,

         a.status,

         l.lab,
         l.course,
         l.batch,
         l.date,
         l.time

      FROM students s

      LEFT JOIN attendance a
      ON s.enrollment_no = a.enrollment_no

      LEFT JOIN lab_info l
      ON s.branch = l.batch

      WHERE DATE(l.date) = ?
      AND l.lab = ?
      AND l.time = ?

      ORDER BY s.name ASC

   `;

   db.query(
      sql,
      [date, lab, time],
      (err, result) => {

         if (err) {

            console.log(err);

            return res.status(500).json({
               success: false,
               error: err.message
            });

         }

         res.status(200).json(result);

      }
   );

};
// Send warning emails
exports.sendWarnings = async (req, res) => {
    const sql = `
    SELECT s.email, s.name,
    CASE 
        WHEN COUNT(a.id) = 0 THEN 0
        ELSE (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100
    END as percentage
    FROM students s
    LEFT JOIN attendance a 
    ON s.enrollment_no = a.enrollment_no
    WHERE s.batch = (
        SELECT batch FROM lab_info ORDER BY id DESC LIMIT 1
    )
    GROUP BY s.enrollment_no
    HAVING percentage < 75
`;

    db.query(sql, async (err, result) => {
        if (err) return res.status(500).json(err);

        for (let student of result) {
            await sendEmail(
                student.email,
                "Attendance Warning",
                `Dear ${student.name}, your attendance is below 75%.`
            );
        }

        res.json({ message: "Emails sent" });
    });
};

// Get today's attendance for dashboard
exports.getTodayAttendance = (
   req,
   res
) => {

   const today =
      new Date()
      .toISOString()
      .split("T")[0];

   const selectedLab =
      req.query.lab;


   // =========================
   // SHOW ALL LABS
   // =========================
   if(
      !selectedLab ||
      selectedLab === "all"
   ) {

      const sql = `

         SELECT

            s.enrollment_no,
            s.name,
            s.branch,
            s.class,

            COALESCE(

               (
                  SELECT a.status
                  FROM attendance a

                  WHERE
                     a.enrollment_no =
                     s.enrollment_no

                  AND a.date = ?

                  LIMIT 1
               ),

               'absent'

            ) AS status

         FROM students s

      `;

      db.query(
         sql,
         [today],
         (err, result) => {

            if(err) {

               console.log(err);

               return res
                  .status(500)
                  .json(err);

            }

            res.json(result);

         }
      );

      return;
   }


   // =========================
   // GET SELECTED LAB
   // =========================

   const labSql = `

      SELECT batch
      FROM lab_info
      WHERE id = ?

   `;

   db.query(
      labSql,
      [selectedLab],
      (err, labResult) => {

         if(err) {

            console.log(err);

            return res
               .status(500)
               .json(err);

         }

         if(labResult.length === 0) {
            return res.json([]);
         }

         const batch =
            labResult[0].batch;


         // =========================
         // FILTER STUDENTS
         // =========================

         const sql = `

            SELECT

               s.enrollment_no,
               s.name,
               s.branch,
               s.class,

               COALESCE(

                  (
                     SELECT a.status
                     FROM attendance a

                     WHERE
                        a.enrollment_no =
                        s.enrollment_no

                     AND a.date = ?

                     LIMIT 1
                  ),

                  'absent'

               ) AS status

            FROM students s

            WHERE s.branch = ?

         `;

         db.query(
            sql,
            [today, batch],
            (err, result) => {

               if(err) {

                  console.log(err);

                  return res
                     .status(500)
                     .json(err);

               }

               res.json(result);

            }
         );
      }
   );
};