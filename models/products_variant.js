"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products_Variant extends Model {
    static associate(models) {
      // Relasi: Satu Varian punya BANYAK Gambar
      Products_Variant.hasMany(models.Products_Variant_Images, {
        foreignKey: "variant_id",
        as: "images", // Kita beri nama alias 'images'
      });

      // Relasi: Satu Varian milik SATU Produk (Induk)
      Products_Variant.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "product",
      });
      Products_Variant.hasMany(models.Carts, {
        foreignKey: "variant_id",
        as: "cart_items",
      });

      // Nanti: Varian ini akan relasi ke 'Carts' dan 'Transaction_Details'
      // Products_Variant.hasMany(models.Carts, ...);
    }
  }
  Products_Variant.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Products_Variant",
      tableName: "Products_Variants",
    }
  );
  return Products_Variant;
};
