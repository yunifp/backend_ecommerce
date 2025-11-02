// models/shop_address.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Shop_Addresses extends Model {
    // Tabel ini tidak punya relasi (associate)
    static associate(models) {
      // (Tidak ada relasi ke tabel lain)
    }
  }
  Shop_Addresses.init(
    {
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      province_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      district_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Shop_Addresses",
      tableName: "Shop_Addresses", // Sesuai standar kita
    }
  );
  return Shop_Addresses;
};
