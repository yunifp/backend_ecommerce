"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Tali Panjat (Ropes)",
          slug: "tali-panjat-ropes",
          description: "Berbagai jenis tali kernmantel, statis, dan dinamis.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sepatu Panjat (Shoes)",
          slug: "sepatu-panjat-shoes",
          description: "Sepatu untuk bouldering, sport climbing, dan trad.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Harness",
          slug: "harness",
          description: "Pengaman badan untuk berbagai tipe panjat.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Carabiner & Quickdraw",
          slug: "carabiner-quickdraw",
          description: "Pengait dan set pengaman untuk jalur panjat.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Menghapus semua data dari tabel Categories
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
