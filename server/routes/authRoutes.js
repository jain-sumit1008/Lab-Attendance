const express = require("express");

const router = express.Router();

const {
   adminLogin,
   studentLogin,
   registerAdmin,
   registerStudent,
   verifyUser
} = require("../controllers/authController");

const authMiddleware =
   require("../middleware/authMiddleware");


// STUDENT
router.post(
   "/student/register",
   registerStudent
);

router.post(
   "/student/login",
   studentLogin
);


// ADMIN
router.post(
   "/admin/register",
   registerAdmin
);

router.post(
   "/admin/login",
   adminLogin
);


// VERIFY TOKEN
router.get(
   "/verify",
   authMiddleware,
   verifyUser
);

module.exports = router;