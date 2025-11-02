// controllers/categoryController.js
const categoryService = require("../services/categoryService");

class CategoryController {
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.success(category, "Category created successfully", 201);
    } catch (error) {
      res.error(error.message, 400); // 400 Bad Request (cth: slug duplikat)
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.success(categories, "Categories retrieved successfully");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.success(category, "Category retrieved successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.success(category, "Category updated successfully");
    } catch (error) {
      if (error.message === "Category not found") {
        return res.error(error.message, 404);
      }
      res.error(error.message, 400); // 400 Bad Request (cth: slug duplikat)
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.success(null, "Category deleted successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }
}

module.exports = new CategoryController();
