// models/user.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mendefinisikan relasi 'one-to-many'
      // KITA KOMENTARI SEMENTARA SAMPAI SEMUA MODEL DIBUAT
      // User.hasMany(models.Addresses, {
      //   foreignKey: 'user_id',
      //   as: 'addresses' // alias untuk relasi
      // });
      // User.hasMany(models.Carts, {
      //   foreignKey: 'user_id',
      //   as: 'cart_items'
      // });
      // User.hasMany(models.Transactions, {
      //   foreignKey: 'user_id',
      //   as: 'transactions'
      // });
      User.hasMany(models.Carts, {
        foreignKey: "user_id",
        as: "cart_items",
      });
    }
  }

  User.init(
    {
      // Ini adalah definisi kolom, harus cocok dengan migrasi
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        allowNull: false,
        defaultValue: "customer",
      },
    },
    {
      sequelize,
      modelName: "User",
      // Kita tidak perlu 'createdAt' & 'updatedAt' di sini
      // karena migrasi kita sudah setting 'defaultValue' di level DB.
      // Sequelize akan otomatis mengenali kolom-kolom itu.
    }
  );

  return User;
};
