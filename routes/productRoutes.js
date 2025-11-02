// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middleware/authenticate");
const adminOrStaff = require("../middleware/adminOrStaff");
const uploadHandler = require("../middleware/uploadHandler");

// --- Terapkan Keamanan ---

// CREATE: Hanya Admin atau Staff
router.post(
  "/",
  authenticate,
  adminOrStaff,
  uploadHandler.any(),
  productController.createProduct
);

// UPDATE: Hanya Admin atau Staff
router.put(
  "/:id",
  authenticate,
  adminOrStaff,
  uploadHandler.any(),
  productController.updateProduct
);

// DELETE: Hanya Admin atau Staff
router.delete(
  "/:id",
  authenticate,
  adminOrStaff,
  productController.deleteProduct
);

// --- Rute Publik ---

// READ ALL: Publik (Semua orang boleh lihat)
router.get("/", productController.getAllProducts);

// READ ONE: Publik (Semua orang boleh lihat)
router.get("/:id", productController.getProductById);

module.exports = router;
