// services/voucherService.js
const voucherRepo = require("../repositories/voucherRepository");
const { Op } = require("sequelize");
const { Vouchers } = require("../models"); 

class VoucherService {
  async createVoucher(data) {
    const { code, type, value, start_date, end_date } = data;
    if (!code || !type || !value || !start_date || !end_date) {
      throw new Error(
        "Code, type, value, start_date, and end_date are required"
      );
    }

    // Cek duplikat code
    const existing = await voucherRepo.findByCode(code);
    if (existing) {
      throw new Error("Voucher code already exists");
    }

    // Validasi tipe percentage
    if (type === "percentage" && (value <= 0 || value > 100)) {
      throw new Error("Percentage value must be between 1 and 100");
    }

    return await voucherRepo.create(data);
  }

  // Untuk Customer
  async getAllVouchers() {
    return await voucherRepo.findAll();
  }

  // Untuk Admin/Staff
  async getAllVouchersAdmin() {
    return await voucherRepo.findAllAdmin();
  }

  async getVoucherById(id) {
    const voucher = await voucherRepo.findById(id);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  }

  async updateVoucher(id, data) {
    const { code, type, value } = data;

    const voucher = await voucherRepo.findById(id);
    if (!voucher) {
      throw new Error("Voucher not found");
    }

    // Cek duplikat code (jika diubah)
    if (code) {
      const existing = await Vouchers.findOne({
        where: {
          code: code,
          id: { [Op.ne]: id }, // Cari kode yg sama, di ID yg BEDA
        },
      });
      if (existing) {
        throw new Error("Voucher code already in use");
      }
    }

    // Validasi tipe percentage
    if (type === "percentage" && value && (value <= 0 || value > 100)) {
      throw new Error("Percentage value must be between 1 and 100");
    }

    return await voucherRepo.update(id, data);
  }

  async deleteVoucher(id) {
    const voucher = await voucherRepo.findById(id);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return await voucherRepo.delete(id);
  }
}

module.exports = new VoucherService();
