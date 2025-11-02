// services/userService.js
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
// 1. KITA BUTUH INI LAGI
const authService = require("./authService");

class UserService {
  async createUser(userData, creator) {
    const { email, password, name, role } = userData;

    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required");
    }

    const roleToCreate = role || "customer";
    if (
      creator &&
      creator.role === "staff" &&
      (roleToCreate === "admin" || roleToCreate === "staff")
    ) {
      throw new Error("Forbidden: Staff cannot create admin or staff accounts");
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
      role: roleToCreate,
    });

    // --- 2. LOGIKA INI DIKEMBALIKAN (SESUAI PERMINTAAN BARU) ---
    try {
      // Kirim email verifikasi (tanpa menunggu, biarkan jalan di background)
      // Kita butuh 'require' di dalam fungsi untuk menghindari circular dependency
      // jika authService juga butuh userService
      const authServiceInstance = require("./authService");
      await authServiceInstance.sendVerificationEmail(newUser);
    } catch (emailError) {
      // Jika email gagal, jangan gagalkan pendaftaran
      console.error(
        `Failed to send verification email for ${newUser.email}: ${emailError.message}`
      );
      // Kita tidak melempar error di sini agar pendaftaran tetap berhasil
    }
    // --- SELESAI ---

    delete newUser.dataValues.password;
    return newUser;
  }

  // ... (Fungsi getAllUsers, getUserById, updateUser, deleteUser tetap sama) ...
  async getAdminAndStaff() {
    return await userRepository.getAllUsers({
      where: {
        role: {
          [Op.in]: ["admin", "staff"], // Ambil yg rolenya 'admin' ATAU 'staff'
        },
      },
    });
  }
  async getCustomers() {
    return await userRepository.getAllUsers({
      where: {
        role: "customer", // Ambil yg rolenya 'customer'
      },
    });
  }

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id, userData) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return await userRepository.updateUser(id, userData);
  }

  async deleteUser(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await userRepository.deleteUser(id);
  }
}

module.exports = new UserService();
