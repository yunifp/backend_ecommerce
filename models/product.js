"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      // Relasi: Satu Produk (Induk) punya BANYAK Varian
      Products.hasMany(models.Products_Variant, {
        foreignKey: "product_id",
        as: "variants", // Kita beri nama alias 'variants'
      });

      // Relasi: Satu Produk milik SATU Kategori
      Products.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  Products.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Sesuai perbaikan kita
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      weight_grams: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_featured: {
        // Kolom baru kamu
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
