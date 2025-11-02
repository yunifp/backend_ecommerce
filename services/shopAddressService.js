// services/shopAddressService.js
const shopAddressRepo = require("../repositories/shopAddressRepository");
const { sequelize } = require("../models");

class ShopAddressService {
  // Logika 'is_default' ada di sini
  async createAddress(data) {
    if (!data.label || !data.city_id || !data.district_id) {
      throw new Error("Label, city_id, and district_id are required");
    }

    // Jika alamat baru ini adalah default
    if (data.is_default && data.is_default === true) {
      const t = await sequelize.transaction();
      try {
        // 1. Set semua alamat lain ke false
        await shopAddressRepo.unsetAllDefaults(t);
        // 2. Buat alamat baru
        const newAddress = await shopAddressRepo.create(data, t);
        // 3. Commit
        await t.commit();
        return newAddress;
      } catch (error) {
        await t.rollback();
        throw new Error(`Transaction failed: ${error.message}`);
      }
    } else {
      // Jika bukan default, langsung buat
      return await shopAddressRepo.create(data);
    }
  }

  async getAllAddresses() {
    return await shopAddressRepo.findAll();
  }

  async getAddressById(id) {
    const address = await shopAddressRepo.findById(id);
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  }

  // Logika 'is_default' juga ada di sini
  async updateAddress(id, data) {
    const address = await shopAddressRepo.findById(id);
    if (!address) {
      throw new Error("Address not found");
    }

    // Jika alamat ini di-set jadi default
    if (data.is_default && data.is_default === true) {
      const t = await sequelize.transaction();
      try {
        // 1. Set semua alamat lain ke false
        await shopAddressRepo.unsetAllDefaults(t);
        // 2. Update alamat ini
        await shopAddressRepo.update(id, data, t);
        // 3. Commit
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw new Error(`Transaction failed: ${error.message}`);
      }
    } else {
      // Jika update biasa, langsung update
      await shopAddressRepo.update(id, data);
    }

    return await shopAddressRepo.findById(id);
  }

  async deleteAddress(id) {
    const address = await shopAddressRepo.findById(id);
    if (!address) {
      throw new Error("Address not found");
    }
    return await shopAddressRepo.delete(id);
  }
}

module.exports = new ShopAddressService();
