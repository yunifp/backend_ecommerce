// services/categoryService.js
const categoryRepository = require("../repositories/categoryRepository");
const { Op } = require("sequelize"); // Import Operator
const { Category } = require("../models");

class CategoryService {
  async createCategory(data) {
    const { name, slug } = data;
    if (!name || !slug) {
      throw new Error("Name and slug are required");
    }

    // Cek duplikat slug
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    return await categoryRepository.create(data);
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async updateCategory(id, data) {
    const { slug } = data;

    // Cek dulu apakah kategorinya ada
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // Jika user ganti slug, cek duplikat
    if (slug) {
      const existing = await Category.findOne({
        where: {
          slug: slug,
          id: { [Op.ne]: id }, // Cari slug yg sama, di ID yg BEDA
        },
      });
      if (existing) {
        throw new Error("Slug already in use by another category");
      }
    }

    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // Kita tidak perlu khawatir soal produk
    // DB akan otomatis set 'category_id' di tabel Products menjadi NULL

    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
