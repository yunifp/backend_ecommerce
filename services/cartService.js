// services/cartService.js
const cartRepository = require("../repositories/cartRepository");
const { Products_Variant, Carts } = require("../models");

class CartService {
  /**
   * Mengambil data cart DAN menghitung total
   */
  async getCart(userId) {
    const items = await cartRepository.findUserCart(userId);

    let subtotal = 0;

    // Format data agar "cantik" sesuai permintaanmu
    const formattedItems = items
      .map((item) => {
        if (!item.variant) {
          // Ini terjadi jika varian produk dihapus tapi masih ada di cart
          // Kita bisa hapus otomatis
          cartRepository.deleteCartItem(item.id, userId);
          return null;
        }

        const variantName = [item.variant.color, item.variant.size]
          .filter(Boolean)
          .join(", ");
        const price = parseFloat(item.variant.price);
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        return {
          cart_item_id: item.id,
          quantity: item.quantity,
          product_name: item.variant.product.name,
          variant_name: variantName,
          price: price,
          item_total: itemTotal,
          image_url:
            item.variant.images.length > 0
              ? item.variant.images[0].image_url
              : null, // Gambar thumbnail
        };
      })
      .filter(Boolean); // Hapus item yang null

    return {
      items: formattedItems,
      subtotal: subtotal,
      // Kamu bisa tambah 'total' di sini jika ada PPN, dll.
    };
  }

  /**
   * Menambah item ke cart
   */
  async addItem(userId, variantId, quantity) {
    // 1. Cek stok dulu
    const variant = await Products_Variant.findByPk(variantId);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (variant.stock < quantity) {
      throw new Error("Not enough stock");
    }

    // 2. Cek duplikat
    const existingItem = await cartRepository.findCartItem(userId, variantId);

    if (existingItem) {
      // --- JIKA DUPLIKAT: UPDATE QUANTITY ---
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        throw new Error("Not enough stock to add more");
      }
      await cartRepository.updateCartItem(existingItem.id, {
        quantity: newQuantity,
      });
      return { message: "Item quantity updated in cart" };
    } else {
      // --- JIKA BARU: CREATE ITEM ---
      await cartRepository.createCartItem({
        user_id: userId,
        variant_id: variantId,
        quantity: quantity,
      });
      return { message: "Item added to cart" };
    }
  }

  /**
   * Mengubah quantity (dari halaman cart)
   */
  async updateItemQuantity(cartItemId, newQuantity, userId) {
    // 0. Pastikan quantity valid
    if (newQuantity <= 0) {
      return await this.deleteItem(cartItemId, userId);
    }

    // 1. Ambil item (dan pastikan milik user)
    const item = await Carts.findOne({
      where: { id: cartItemId, user_id: userId },
    });
    if (!item) {
      throw new Error("Cart item not found");
    }

    // 2. Cek stok
    const variant = await Products_Variant.findByPk(item.variant_id);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (variant.stock < newQuantity) {
      throw new Error("Not enough stock");
    }

    // 3. Update
    await cartRepository.updateCartItem(cartItemId, { quantity: newQuantity });
    return { message: "Cart quantity updated" };
  }

  /**
   * Menghapus satu item
   */
  async deleteItem(cartItemId, userId) {
    const result = await cartRepository.deleteCartItem(cartItemId, userId);
    if (result === 0) {
      throw new Error("Cart item not found or does not belong to user");
    }
    return { message: "Item removed from cart" };
  }

  /**
   * Mengosongkan cart
   */
  async clearCart(userId) {
    await cartRepository.clearUserCart(userId);
    return { message: "Cart cleared" };
  }
}

module.exports = new CartService();
