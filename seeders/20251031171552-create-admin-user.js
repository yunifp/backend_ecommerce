"use strict";
// Kita butuh bcryptjs untuk hashing password
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tentukan password
    const plainPassword = "password123"; // Ganti ini dengan password yang aman

    // 2. Buat salt (pengacak)
    const salt = await bcrypt.genSalt(10);

    // 3. Hash password-nya
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 4. Masukkan data admin ke tabel Users
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin Toko",
          email: "admin@example.com", // Ganti dengan email admin Anda
          password: hashedPassword,
          phone_number: "08123456789",
          role: "admin", // PENTING: Set role-nya
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Perintah 'down' akan menghapus data yang kita masukkan tadi
    await queryInterface.bulkDelete(
      "Users",
      {
        email: "admin@example.com", // Hapus user dengan email ini
      },
      {}
    );
  },
};