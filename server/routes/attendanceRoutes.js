const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
const {
    markAttendance,
    getByDate,
    getReport,
    sendWarnings,
    getTodayAttendance   // 🔥 ADD THIS
} = require("../controllers/attendanceController");

router.post("/mark",authMiddleware,adminMiddleware, markAttendance);
router.get("/date/:date",authMiddleware,adminMiddleware,  getByDate);
router.get("/report",authMiddleware,  getReport);
router.post("/send-warning", authMiddleware,adminMiddleware, sendWarnings);
router.get("/today",authMiddleware,  getTodayAttendance);


module.exports = router;