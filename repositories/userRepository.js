// repositories/userRepository.js
const { User } = require("../models");

// Opsi untuk menyembunyikan password
const excludePassword = {
  attributes: { exclude: ["password"] },
};

class UserRepository {
  // ... (fungsi createUser, getAllUsers, dll) ...
  async getAllUsers(options = {}) {
    // Gabungkan 'options' (cth: 'where' clause)
    // dengan 'excludePassword'
    const queryOptions = {
      ...options,
      ...excludePassword,
    };

    // Jika 'options' punya 'where', gabungkan dengan benar
    if (options.where) {
      queryOptions.where = { ...options.where, ...excludePassword.where };
    }

    return await User.findAll(queryOptions);
  }
  async getUserById(id) {
    return await User.findByPk(id, excludePassword);
  }
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
  async updateUser(id, userData) {
    await User.update(userData, {
      where: { id },
    });
    return await this.getUserById(id); // Kembalikan data yg sudah diupdate
  }
  async deleteUser(id) {
    return await User.destroy({
      where: { id },
    });
  }
}

module.exports = new UserRepository();
