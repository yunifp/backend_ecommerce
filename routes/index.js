// routes/index.js
const express = require("express");
const router = express.Router();

// Import router lain
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const categoryRoutes = require("./categoryRoutes");
const shopAddressRoutes = require("./shopAddressRoutes");
const voucherRoutes = require("./voucherRoutes");

// Daftarkan router
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/shop-addresses", shopAddressRoutes);
router.use("/vouchers", voucherRoutes);
// router.use('/products', productRoutes); // Contoh untuk nanti

module.exports = router;
