// routes/voucherRoutes.js
const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const authenticate = require("../middleware/authenticate");
const adminOrStaff = require("../middleware/adminOrStaff");
const tryAuthenticate = require("../middleware/tryAuthenticate"); // Middleware baru

// --- Rute yang Diamankan (Hanya Admin/Staff) ---

// CREATE
router.post("/", authenticate, adminOrStaff, voucherController.createVoucher);

// UPDATE
router.put("/:id", authenticate, adminOrStaff, voucherController.updateVoucher);

// DELETE
router.delete(
  "/:id",
  authenticate,
  adminOrStaff,
  voucherController.deleteVoucher
);

// --- Rute Publik (Frontend bisa akses) ---

// READ ALL
// Kita pakai 'tryAuthenticate' agar tahu jika yg akses admin
router.get("/", tryAuthenticate, voucherController.getAllVouchers);

// READ ONE
router.get("/:id", voucherController.getVoucherById);

module.exports = router;
