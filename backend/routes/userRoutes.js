const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUserProfile,
  updateProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);



module.exports = router;