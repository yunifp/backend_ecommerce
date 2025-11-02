// controllers/voucherController.js
const voucherService = require("../services/voucherService");

class VoucherController {
  async createVoucher(req, res) {
    try {
      const voucher = await voucherService.createVoucher(req.body);
      res.success(voucher, "Voucher created successfully", 201);
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  async getAllVouchers(req, res) {
    try {
      // Cek jika yg request admin/staff, beri data lengkap
      if (
        req.user &&
        (req.user.role === "admin" || req.user.role === "staff")
      ) {
        const vouchers = await voucherService.getAllVouchersAdmin();
        res.success(vouchers, "All vouchers retrieved (Admin)");
      } else {
        // Jika publik, beri data yg aktif saja
        const vouchers = await voucherService.getAllVouchers();
        res.success(vouchers, "Active vouchers retrieved");
      }
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getVoucherById(req, res) {
    try {
      const voucher = await voucherService.getVoucherById(req.params.id);
      res.success(voucher, "Voucher retrieved successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }

  async updateVoucher(req, res) {
    try {
      const voucher = await voucherService.updateVoucher(
        req.params.id,
        req.body
      );
      res.success(voucher, "Voucher updated successfully");
    } catch (error) {
      if (error.message === "Voucher not found") {
        return res.error(error.message, 404);
      }
      res.error(error.message, 400);
    }
  }

  async deleteVoucher(req, res) {
    try {
      await voucherService.deleteVoucher(req.params.id);
      res.success(null, "Voucher deleted successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }
}

module.exports = new VoucherController();
