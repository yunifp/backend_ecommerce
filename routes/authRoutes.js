// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const guestOnly = require("../middleware/guestOnly");
const authenticate = require("../middleware/authenticate");

// Endpoint: POST /api/v1/auth/login
router.post("/login", guestOnly, authController.login);

router.post("/logout", authenticate, authController.logout);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
// Nanti bisa tambah /register di sini juga
// router.post('/register', userController.createUser);

module.exports = router;
