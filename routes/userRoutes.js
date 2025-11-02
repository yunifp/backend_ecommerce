// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Import middleware kita
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");
const adminOrStaff = require("../middleware/adminOrStaff"); // <-- IMPORT BARU

// --- Terapkan Keamanan ---

// CREATE
// Sekarang diamankan, hanya admin/staff yang bisa buat user baru
router.post(
  "/",
  authenticate, // Cek login
  adminOrStaff, // Cek admin/staff
  userController.createUser // Controller yang sudah dimodifikasi
);


// READ (Get One User)
router.get(
  "/:id",
  authenticate,
  adminOrStaff, // Boleh diakses admin atau staff
  userController.getUserById
);

// UPDATE
router.put("/:id", authenticate, adminOrStaff, userController.updateUser);
router.patch("/:id", authenticate, adminOrStaff, userController.updateUser);

// DELETE
router.delete("/:id", authenticate, adminOrStaff, userController.deleteUser);

module.exports = router;
