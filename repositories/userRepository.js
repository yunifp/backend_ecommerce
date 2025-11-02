// repositories/userRepository.js
const { User } = require("../models");

// Opsi untuk menyembunyikan password
const excludePassword = {
  attributes: { exclude: ["password"] },
};

class UserRepository {
  // ... (fungsi createUser, getAllUsers, dll) ...

  async getUserByEmail(email, includePassword = false) {
    // Tentukan opsi query
    const options = { where: { email } };

    // Jika 'includePassword' false, gunakan 'excludePassword'
    if (!includePassword) {
      options.attributes = excludePassword.attributes;
    }

    // Jika 'includePassword' true, jangan tambahkan apa-apa
    // (Sequelize akan mengambil semua kolom, TERMASUK password)

    return await User.findOne(options);
  }

  // ... (fungsi updateUser, deleteUser, dll) ...
}

module.exports = new UserRepository();
