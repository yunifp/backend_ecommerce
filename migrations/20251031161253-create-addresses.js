"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Nama tabel yang direferensi
          key: "id", // Kolom yang direferensi
        },
        onUpdate: "CASCADE", // Jika id user berubah, update di sini
        onDelete: "CASCADE", // Jika user dihapus, alamatnya ikut terhapus
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false, // Misal: "Rumah", "Kantor"
      },
      recipient_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipient_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_address: {
        type: Sequelize.TEXT,
        allowNull: false, // Nama jalan, nomor rumah, RT/RW
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
        allowNull: false, // PENTING: Ini ID tujuan pengiriman (destination)
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
    await queryInterface.dropTable("Addresses");
  },
};
