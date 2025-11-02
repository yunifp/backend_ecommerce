// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/authenticate");

// --- PENTING! ---
// Semua rute cart WAJIB login.
// Kita terapkan 'authenticate' di level router.
router.use(authenticate);

// GET /api/v1/carts (Get keranjang user)
router.get("/", cartController.getCart);

// POST /api/v1/carts (Tambah item ke keranjang)
router.post("/", cartController.addItem);

// PUT /api/v1/carts/:id (Update quantity item, :id di sini adalah ID cart_item)
router.put("/:id", cartController.updateItem);

// DELETE /api/v1/carts/:id (Hapus 1 item dari keranjang)
router.delete("/:id", cartController.deleteItem);

// DELETE /api/v1/carts (Kosongkan semua keranjang)
router.delete("/", cartController.clearCart);

module.exports = router;
