// services/authService.js
const userRepository = require('../repositories/userRepository');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // <-- 1. IMPORT CRYPTO
const { User } = require('../models');
const { Op } = require('sequelize'); // <-- 2. IMPORT OPERATOR

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Panggil repository dan MINTA password-nya
    const user = await userRepository.getUserByEmail(email, true);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // PENTING: Hapus password dari objek user SEBELUM dikembalikan
    delete user.dataValues.password;

    // Kembalikan token DAN data user
    return { token, user };
  }
  async forgotPassword(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await User.findOne({ where: { email } });

    // PENTING: Jangan beri tahu jika email tidak ada
    // Ini untuk mencegah 'user enumeration attack'
    if (!user) {
      return; 
    }

    // 1. Buat token acak (bukan OTP)
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Hash token ini untuk disimpan di DB (SANGAT AMAN)
    // Kita pakai sha256, bukan bcrypt, agar bisa dicari
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Set kedaluwarsa (1 jam)
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // 4. Simpan hash & expires ke user
    await user.update({
      verification_token: hashedToken,
      verification_expires: expires
    });

    // 5. Kirim email (yang berisi token PLAIN TEXT)
    await emailService.sendPasswordResetEmail(user.email, token);
  }

  // --- FUNGSI BARU 2: RESET PASSWORD ---
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    // 1. Hash token yang masuk untuk dicari di DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // 2. Cari user berdasarkan hash DAN belum kedaluwarsa
    const user = await User.findOne({
      where: {
        verification_token: hashedToken,
        verification_expires: { [Op.gt]: new Date() } // Cek jika > dari 'sekarang'
      }
    });

    // 3. Jika token tidak valid atau expired
    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    // 4. Sukses! Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update password & bersihkan token
    await user.update({
      password: hashedPassword,
      verification_token: null,
      verification_expires: null
    });

    return { message: 'Password reset successfully' };
  }
}

module.exports = new AuthService();
