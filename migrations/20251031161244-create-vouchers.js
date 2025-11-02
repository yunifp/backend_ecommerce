"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vouchers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Kode voucher harus unik
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM("percentage", "fixed_amount"),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2), // Nilai diskon (bisa persen atau rupiah)
        allowNull: false,
      },
      max_discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true, // Opsional: batas maks diskon jika tipenya 'percentage'
      },
      min_purchase: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0, // Minimal belanja untuk bisa pakai voucher
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // Berapa kali voucher bisa dipakai
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable("Vouchers");
  },
};
