"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id_display: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ini untuk 'TRX-1001' Anda
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Kita set true
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // PENTING: Jika user dihapus, history transaksi tetap ada
      },
      // --- Rincian Finansial ---
      total_price: {
        type: Sequelize.DECIMAL(12, 2), // Total harga produk saja
        allowNull: false,
      },
      shipping_cost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      service_fee: {
        type: Sequelize.DECIMAL(12, 2), // Biaya layanan yg dibebankan ke pelanggan
        allowNull: false,
        defaultValue: 0.0,
      },
      grand_total: {
        type: Sequelize.DECIMAL(12, 2), // Total akhir yang dibayar pelanggan
        allowNull: false,
      },
      // --- Rincian Pengiriman ---
      shipping_address: {
        type: Sequelize.TEXT, // Disimpan sebagai JSON string snapshot
        allowNull: false,
      },
      courier: {
        type: Sequelize.STRING, // Misal: 'jne', 'jnt'
        allowNull: false,
      },
      shipping_service: {
        type: Sequelize.STRING, // Misal: 'REG', 'YES'
        allowNull: false,
      },
      shipping_receipt_number: {
        type: Sequelize.STRING,
        allowNull: true, // Diisi admin saat barang dikirim
      },
      // --- Status & Pembayaran ---
      status: {
        type: Sequelize.ENUM(
          "pending", // Menunggu pembayaran
          "paid", // Dibayar, tunggu diproses admin
          "processing", // Sedang disiapkan
          "shipped", // "Dalam Pengiriman" (sudah ada resi)
          "completed", // "Sukses" (selesai)
          "failed", // "Gagal"
          "cancelled" // Dibatalkan
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      midtrans_token: {
        type: Sequelize.STRING,
        allowNull: false, // Token snap.js dari Midtrans
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false, // Misal: 'bca_va', 'gopay'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
