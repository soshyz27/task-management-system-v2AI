const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Định tuyến cho tính năng Đăng ký
router.post("/register", authController.register);

// Định tuyến cho tính năng Đăng nhập
router.post("/login", authController.login);

module.exports = router;