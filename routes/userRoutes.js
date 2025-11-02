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
  adminOnly, // Cek admin/staff
  userController.createUser // Controller yang sudah dimodifikasi
);
router.get(
  "/me",
  authenticate, // Hanya perlu login
  userController.getMe // Controller baru
);
// UPDATE
router.put("/:id", authenticate, adminOrStaff, userController.updateUser);
router.patch("/:id", authenticate, adminOrStaff, userController.updateUser);

// DELETE
router.get(
  "/adminstaff",
  authenticate,
  adminOnly, // <-- Dikunci hanya untuk Admin
  userController.getAdminStaff
);
router.get(
  "/customer",
  authenticate,
  adminOnly, // <-- Dikunci hanya untuk Admin
  userController.getCustomers
);
router.put(
  "/adminstaff/:id", // <-- BUG DIPERBAIKI (tambah /)
  authenticate,
  adminOnly,
  userController.updateUser
);
router.patch(
  "/adminstaff/:id", // <-- Saya tambahkan untuk konsistensi
  authenticate,
  adminOnly,
  userController.updateUser
);

// UPDATE satu Customer (PUT atau PATCH)
router.put(
  "/customer/:id", // <-- Saya tambahkan untuk konsistensi
  authenticate,
  adminOnly,
  userController.updateUser
);
router.patch(
  "/customer/:id", // <-- BUG DIPERBAIKI (tambah /)
  authenticate,
  adminOnly,
  userController.updateUser
);

// DELETE satu Admin/Staff
router.delete(
  "/adminstaff/:id",
  authenticate,
  adminOnly,
  userController.deleteUser
);

// DELETE satu Customer
router.delete(
  "/customer/:id",
  authenticate,
  adminOnly,
  userController.deleteUser
);
// READ (Get One User)
router.get(
  "/adminstaff/:id",
  authenticate,
  adminOnly, // Boleh diakses admin atau staff
  userController.getUserById
);
router.get(
  "/customer/:id",
  authenticate,
  adminOnly, // Boleh diakses admin atau staff
  userController.getUserById
);


module.exports = router;
