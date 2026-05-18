const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
const {
    markAttendance,
    getByDate,
    getReport,
    sendWarnings,
    getTodayAttendance, 
    getAttendanceByDate, 
    getFilteredReport// 🔥 ADD THIS
} = require("../controllers/attendanceController");

router.post("/mark",authMiddleware,adminMiddleware, markAttendance);
router.get("/date/:date",authMiddleware,adminMiddleware,  getByDate);
router.get("/report",authMiddleware,  getReport);
router.post("/send-warning", authMiddleware,adminMiddleware, sendWarnings);
router.get("/today",authMiddleware,  getTodayAttendance);
router.get("/attendance/date/:date",authMiddleware,adminMiddleware, getAttendanceByDate);
router.get("/report/filter",authMiddleware,adminMiddleware,  getFilteredReport);
module.exports = router;