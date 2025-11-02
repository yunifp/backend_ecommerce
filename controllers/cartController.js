// controllers/cartController.js
const cartService = require("../services/cartService");

class CartController {
  async getCart(req, res) {
    try {
      const userId = req.user.id; // Dari middleware 'authenticate'
      const cart = await cartService.getCart(userId);
      res.success(cart, "Cart retrieved successfully");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { variant_id, quantity } = req.body;

      if (!variant_id || !quantity || quantity <= 0) {
        return res.error("variant_id and a valid quantity are required", 400);
      }

      const result = await cartService.addItem(userId, variant_id, quantity);
      res.success(result, result.message, 201); // 201 Created
    } catch (error) {
      res.error(error.message, 400); // 400 Bad Request
    }
  }

  async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const cartItemId = req.params.id;
      const { quantity } = req.body;

      if (!quantity) {
        return res.error("Quantity is required", 400);
      }

      const result = await cartService.updateItemQuantity(
        cartItemId,
        quantity,
        userId
      );
      res.success(result, result.message);
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  async deleteItem(req, res) {
    try {
      const userId = req.user.id;
      const cartItemId = req.params.id;

      const result = await cartService.deleteItem(cartItemId, userId);
      res.success(result, result.message);
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await cartService.clearCart(userId);
      res.success(result, result.message);
    } catch (error) {
      res.error(error.message, 500);
    }
  }
}

module.exports = new CartController();
