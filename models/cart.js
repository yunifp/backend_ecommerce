// models/cart.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    static associate(models) {
      // Relasi: Satu item Cart milik SATU User
      Carts.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Relasi: Satu item Cart milik SATU Varian Produk
      Carts.belongsTo(models.Products_Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }
  Carts.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Carts",
      tableName: "Carts", // Sesuai standar kita
    }
  );
  return Carts;
};
