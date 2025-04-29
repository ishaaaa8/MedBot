const express = require("express");
const { loginUser, registerUser ,loginAdmin} = require("../controllers/authController"); // Ensure these functions exist

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/adminlogin", loginAdmin); // Admin login route


module.exports = router;
