// routes/shopAddressRoutes.js
const express = require("express");
const router = express.Router();
const shopAddressController = require("../controllers/shopAddressController");
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");

// --- PENTING! ---
// Terapkan 'authenticate' DAN 'adminOnly' ke SEMUA rute
router.use(authenticate);
router.use(adminOnly);

// CREATE
router.post("/", shopAddressController.createAddress);

// READ ALL
router.get("/", shopAddressController.getAllAddresses);

// READ ONE
router.get("/:id", shopAddressController.getAddressById);

// UPDATE
router.put("/:id", shopAddressController.updateAddress);

// DELETE
router.delete("/:id", shopAddressController.deleteAddress);

module.exports = router;
