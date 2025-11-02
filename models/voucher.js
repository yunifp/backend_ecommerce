// models/voucher.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vouchers extends Model {
    /**
     * Nanti kita bisa tambahkan relasi ke Transactions
     * Vouchers.hasMany(models.Transactions, { foreignKey: 'voucher_id' });
     */
    static associate(models) {
      // (Untuk saat ini tidak ada relasi)
    }
  }
  Vouchers.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("percentage", "fixed_amount"),
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      min_purchase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      quota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Vouchers",
      tableName: "Vouchers", // Sesuai standar kita
    }
  );
  return Vouchers;
};
