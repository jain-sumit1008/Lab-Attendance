const express = require("express");
const router = express.Router();
const {
    markAttendance,
    getByDate,
    getReport,
    sendWarnings,
    getTodayAttendance   // 🔥 ADD THIS
} = require("../controllers/attendanceController");

router.post("/mark", markAttendance);
router.get("/date/:date", getByDate);
router.get("/report", getReport);
router.post("/send-warning", sendWarnings);
router.get("/today", getTodayAttendance);


module.exports = router;