// repositories/categoryRepository.js
const { Category, Products } = require("../models");

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findAll() {
    return await Category.findAll({
      include: [
        {
          model: Products,
          as: "products",
          attributes: ["id", "name"], // Opsional: ambil produk di dalamnya
        },
      ],
    });
  }

  async findById(id) {
    return await Category.findByPk(id, {
      include: [
        {
          model: Products,
          as: "products",
        },
      ],
    });
  }

  async findBySlug(slug) {
    return await Category.findOne({ where: { slug } });
  }

  async update(id, data) {
    await Category.update(data, {
      where: { id },
    });
    return this.findById(id);
  }

  async delete(id) {
    return await Category.destroy({
      where: { id },
    });
  }
}

module.exports = new CategoryRepository();
