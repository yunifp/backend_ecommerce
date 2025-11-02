// controllers/shopAddressController.js
const shopAddressService = require("../services/shopAddressService");

class ShopAddressController {
  async createAddress(req, res) {
    try {
      const address = await shopAddressService.createAddress(req.body);
      res.success(address, "Shop address created successfully", 201);
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  async getAllAddresses(req, res) {
    try {
      const addresses = await shopAddressService.getAllAddresses();
      res.success(addresses, "Shop addresses retrieved successfully");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getAddressById(req, res) {
    try {
      const address = await shopAddressService.getAddressById(req.params.id);
      res.success(address, "Shop address retrieved successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }

  async updateAddress(req, res) {
    try {
      const address = await shopAddressService.updateAddress(
        req.params.id,
        req.body
      );
      res.success(address, "Shop address updated successfully");
    } catch (error) {
      if (error.message === "Address not found") {
        return res.error(error.message, 404);
      }
      res.error(error.message, 400);
    }
  }

  async deleteAddress(req, res) {
    try {
      await shopAddressService.deleteAddress(req.params.id);
      res.success(null, "Shop address deleted successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }
}

module.exports = new ShopAddressController();
