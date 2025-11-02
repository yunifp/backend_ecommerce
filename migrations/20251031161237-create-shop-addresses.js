"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shop_Addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false, // Misal: "Gudang Utama"
      },
      full_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      province_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // PENTING: Ini ID asal pengiriman (origin)
      },
      district_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // PENTING: Menandai alamat origin utama
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
    await queryInterface.dropTable("Shop_Addresses");
  },
};
