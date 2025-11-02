"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // NAMA TABEL DI SINI DIUBAH
    await queryInterface.createTable("Products_Variant_Images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      variant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products_Variants", // <-- REFERENSI DIUBAH
          key: "id",
        },
        onDelete: "CASCADE",
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_thumbnail: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // NAMA TABEL DI SINI JUGA DIUBAH
    await queryInterface.dropTable("Products_Variant_Images");
  },
};
