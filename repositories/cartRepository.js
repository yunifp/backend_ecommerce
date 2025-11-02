// repositories/cartRepository.js
const {
  Carts,
  Products_Variant,
  Products,
  Products_Variant_Images,
} = require("../models");

// Ini adalah "peta" JOIN kita
const EAGER_LOAD_CONFIG = {
  include: [
    {
      model: Products_Variant,
      as: "variant", // (Carts -> Products_Variant)
      include: [
        {
          model: Products, // (Products_Variant -> Products)
          as: "product",
          attributes: ["name"], // Hanya ambil nama produk
        },
        {
          model: Products_Variant_Images, // (Products_Variant -> Images)
          as: "images",
          where: { is_thumbnail: true }, // Hanya ambil gambar thumbnail
          required: false, // Gunakan LEFT JOIN
        },
      ],
    },
  ],
};

class CartRepository {
  /**
   * Mengambil semua item cart milik user dengan data produk lengkap
   */
  async findUserCart(userId) {
    return await Carts.findAll({
      where: { user_id: userId },
      ...EAGER_LOAD_CONFIG, // Terapkan JOIN kompleks
    });
  }

  /**
   * Mencari satu item cart (untuk cek duplikat)
   */
  async findCartItem(userId, variantId) {
    return await Carts.findOne({
      where: { user_id: userId, variant_id: variantId },
    });
  }

  /**
   * Membuat item baru di cart
   */
  async createCartItem(data) {
    return await Carts.create(data);
  }

  /**
   * Mengubah data item di cart (cth: quantity)
   */
  async updateCartItem(cartItemId, data) {
    return await Carts.update(data, {
      where: { id: cartItemId },
    });
  }

  /**
   * Menghapus satu item dari cart
   */
  async deleteCartItem(cartItemId, userId) {
    return await Carts.destroy({
      where: {
        id: cartItemId,
        user_id: userId, // Pastikan user hanya bisa hapus item miliknya
      },
    });
  }

  /**
   * Menghapus SEMUA item dari cart user
   */
  async clearUserCart(userId) {
    return await Carts.destroy({
      where: { user_id: userId },
    });
  }
}

module.exports = new CartRepository();
