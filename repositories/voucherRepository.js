// repositories/voucherRepository.js
const { Vouchers } = require("../models");
const { Op } = require("sequelize");

class VoucherRepository {
  async create(data) {
    return await Vouchers.create(data);
  }

  async findAll() {
    return await Vouchers.findAll({
      where: {
        is_active: true,
        end_date: { [Op.gt]: new Date() }, // Hanya tampilkan yg aktif & belum expired
      },
    });
  }

  // Fungsi untuk Admin (melihat semua, termasuk yg expired)
  async findAllAdmin() {
    return await Vouchers.findAll();
  }

  async findById(id) {
    return await Vouchers.findByPk(id);
  }

  async findByCode(code) {
    return await Vouchers.findOne({ where: { code } });
  }

  async update(id, data) {
    await Vouchers.update(data, {
      where: { id },
    });
    return this.findById(id);
  }

  async delete(id) {
    return await Vouchers.destroy({
      where: { id },
    });
  }
}

module.exports = new VoucherRepository();
