// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middleware/authenticate");
const adminOrStaff = require("../middleware/adminOrStaff");

// --- Rute yang Diamankan (Hanya Admin/Staff) ---

// CREATE
router.post("/", authenticate, adminOrStaff, categoryController.createCategory);

// UPDATE
router.put(
  "/:id",
  authenticate,
  adminOrStaff,
  categoryController.updateCategory
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  adminOrStaff,
  categoryController.deleteCategory
);

// --- Rute Publik (Untuk Frontend) ---

// READ ALL
router.get("/", categoryController.getAllCategories);

// READ ONE
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
