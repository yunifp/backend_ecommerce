"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize"); // Kita butuh Operator

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Password untuk Staff
    const staffPassword = "staff123";
    const staffSalt = await bcrypt.genSalt(10);
    const hashedStaffPassword = await bcrypt.hash(staffPassword, staffSalt);

    // 2. Password untuk Guest (Kamu)
    const guestPassword = "password123"; // Kamu bisa ganti ini
    const guestSalt = await bcrypt.genSalt(10);
    const hashedGuestPassword = await bcrypt.hash(guestPassword, guestSalt);

    // 3. Masukkan 2 user baru
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Staff Toko",
          email: "staff@toko.com",
          password: hashedStaffPassword,
          phone_number: "081212121212",
          role: "staff",
          is_email_verified: true, // Kita set true agar gampang ngetes
          is_phone_verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rio Ezar", // Guest kamu
          email: "ezrampage33@gmail.com",
          password: hashedGuestPassword,
          phone_number: "08157684062",
          role: "customer",
          is_email_verified: false, // Kita set false agar bisa ngetes verifikasi
          is_phone_verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Hapus spesifik 2 user yang kita tambah
    await queryInterface.bulkDelete(
      "Users",
      {
        email: {
          [Op.in]: ["staff@toko.com", "ezrampage33@gmail.com"],
        },
      },
      {}
    );
  },
};
