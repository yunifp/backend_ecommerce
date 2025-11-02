// controllers/productController.js
const productService = require("../services/productService");

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body, req.files);
      res.success(product, "Product created successfully", 201);
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.success(products, "Products retrieved successfully");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.success(product, "Product retrieved successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.files
      );
      res.success(product, "Product updated successfully");
    } catch (error) {
      // Cek tipe error-nya
      if (error.message.includes("Product not found")) {
        res.error(error.message, 404); // Kirim 404 HANYA jika produk tidak ada
      } else {
        // Kirim 400 untuk semua error validasi lainnya
        res.error(error.message, 400);
      }
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.success(null, "Product deleted successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }
}

module.exports = new ProductController();
