// repositories/shopAddressRepository.js
const { Shop_Addresses } = require("../models");

class ShopAddressRepository {
  async create(data, transaction = null) {
    return await Shop_Addresses.create(data, { transaction });
  }

  async findAll() {
    return await Shop_Addresses.findAll();
  }

  async findById(id) {
    return await Shop_Addresses.findByPk(id);
  }

  async update(id, data, transaction = null) {
    return await Shop_Addresses.update(data, {
      where: { id },
      transaction,
    });
  }

  async delete(id) {
    return await Shop_Addresses.destroy({
      where: { id },
    });
  }

  // Helper untuk mematikan semua 'is_default'
  async unsetAllDefaults(transaction = null) {
    return await Shop_Addresses.update(
      { is_default: false },
      { where: { is_default: true }, transaction }
    );
  }
}

module.exports = new ShopAddressRepository();
