"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products_Variant_Images extends Model {
    static associate(models) {
      // Relasi: Satu Gambar milik SATU Varian
      Products_Variant_Images.belongsTo(models.Products_Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }
  Products_Variant_Images.init(
    {
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_thumbnail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Products_Variant_Images",
      tableName: "Products_Variant_Images",
    }
  );
  return Products_Variant_Images;
};
