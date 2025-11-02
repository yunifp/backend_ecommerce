// repositories/productRepository.js
const {
  sequelize,
  Products,
  Products_Variant,
  Products_Variant_Images,
  Category,
} = require("../models");
const fs = require("fs");
const path = require("path");

// Ini adalah "peta" relasi kita untuk di-JOIN
const EAGER_LOAD_CONFIG = {
  include: [
    {
      model: Products_Variant,
      as: "variants", // Ambil semua varian
      include: [
        {
          model: Products_Variant_Images,
          as: "images", // Ambil semua gambar dari tiap varian
        },
      ],
    },
    {
      model: Category,
      as: "category", // Ambil kategori produk
    },
  ],
};

class ProductRepository {
  /**
   * Mengambil SEMUA produk dengan varian dan gambarnya (Nested Join)
   */
  async findAllProducts() {
    return await Products.findAll(EAGER_LOAD_CONFIG);
  }

  /**
   * Mengambil SATU produk dengan varian dan gambarnya
   */
  async findProductById(id) {
    return await Products.findByPk(id, EAGER_LOAD_CONFIG);
  }

  /**
   * Menghapus produk.
   * (CASCADE akan menghapus varian & gambar secara otomatis)
   */
  async deleteProduct(id) {
    return await Products.destroy({
      where: { id },
    });
  }

  /**
   * Ini adalah logika TRANSAKSI yang kompleks.
   * Kita harus menyimpan ke 3 tabel sekaligus.
   */
  async createProduct(productData) {
    // 1. Ambil data varian & data produk induk
    const { variants, ...productIndukData } = productData;

    if (!variants || variants.length === 0) {
      throw new Error("Product must have at least one variant");
    }

    // 2. Mulai Transaksi Database
    const t = await sequelize.transaction();

    try {
      // 3. Simpan Produk Induk (Tabel 1: Products)
      const newProduct = await Products.create(productIndukData, {
        transaction: t,
      });

      // 4. Loop dan simpan semua Varian (Tabel 2: Products_Variant)
      for (const variantData of variants) {
        const { images, ...variantIndukData } = variantData;

        if (!images || images.length === 0) {
          throw new Error("Variant must have at least one image");
        }

        const newVariant = await Products_Variant.create(
          {
            ...variantIndukData,
            product_id: newProduct.id, // Tautkan ke Induk
          },
          { transaction: t }
        );

        // 5. Loop dan simpan semua Gambar (Tabel 3: Products_Variant_Images)

        // Siapkan data gambar (tambahkan variant_id)
        const imagesData = images.map((img) => ({
          ...img,
          variant_id: newVariant.id, // Tautkan ke Varian
        }));

        await Products_Variant_Images.bulkCreate(imagesData, {
          transaction: t,
        });
      }

      // 6. Jika semua berhasil, commit transaksi
      await t.commit();

      // 7. Kembalikan data lengkap produk yang baru dibuat
      return await this.findProductById(newProduct.id);
    } catch (error) {
      // 8. Jika ada SATU saja error, batalkan semua (rollback)
      await t.rollback();
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(productId, productData) {
    const { variants, ...productIndukData } = productData;
    const t = await sequelize.transaction();
    let allUrlsToDelete = []; // Kumpulan file yg akan dihapus dari disk

    try {
      // 1. UPDATE Produk Induk
      await Products.update(productIndukData, {
        where: { id: productId },
        transaction: t,
      });

      // 2. Ambil ID varian lama dari DB
      const oldVariants = await Products_Variant.findAll({
        where: { product_id: productId },
        transaction: t,
      });
      const oldVariantIds = oldVariants.map((v) => v.id);

      // 3. Ambil ID varian yang "masih ada" dari request
      const newVariantIds = variants
        .filter((v) => v.id) // Filter varian yg punya ID
        .map((v) => v.id);

      // 4. Proses Varian (Update, Create)
      for (const variantData of variants) {
        const { images, ...variantIndukData } = variantData;

        if (variantData.id) {
          // --- UPDATE VARIAN LAMA ---
          await Products_Variant.update(variantIndukData, {
            where: { id: variantData.id },
            transaction: t,
          });
          // Panggil helper "Diffing" gambar
          const urls = await this.syncVariantImages(variantData.id, images, t);
          allUrlsToDelete.push(...urls);
        } else {
          // --- BUAT VARIAN BARU ---
          const newVariant = await Products_Variant.create(
            {
              ...variantIndukData,
              product_id: productId,
            },
            { transaction: t }
          );

          // Buat gambar untuk varian baru ini
          if (images && images.length > 0) {
            await Products_Variant_Images.bulkCreate(
              images.map((img) => ({ ...img, variant_id: newVariant.id })),
              { transaction: t }
            );
          }
        }
      }

      // 5. HAPUS Varian Lama (ID lama yg tidak ada di request baru)
      const variantIdsToDelete = oldVariantIds.filter(
        (id) => !newVariantIds.includes(id)
      );
      if (variantIdsToDelete.length > 0) {
        // Ambil gambar dari varian yg akan dihapus (untuk dihapus filenya)
        const imagesToDelete = await Products_Variant_Images.findAll({
          where: { variant_id: variantIdsToDelete },
          transaction: t,
        });
        allUrlsToDelete.push(...imagesToDelete.map((img) => img.image_url));

        // Hapus dari DB (anak dulu, baru induk)
        await Products_Variant_Images.destroy({
          where: { variant_id: variantIdsToDelete },
          transaction: t,
        });
        await Products_Variant.destroy({
          where: { id: variantIdsToDelete },
          transaction: t,
        });
      }

      // 6. Transaksi Selesai
      await t.commit();

      // 7. (Setelah Commit) Hapus file fisik dari disk
      for (const url of allUrlsToDelete) {
        const relativeUrl = url.substring(1);
        const filePath = path.join(__dirname, "..", relativeUrl);
        fs.unlink(filePath, (err) => {
          if (err)
            console.error(`Failed to delete old image: ${filePath}`, err);
        });
      }

      return await this.findProductById(productId);
    } catch (error) {
      await t.rollback();
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
  async syncVariantImages(variantId, imagesData, t) {
    const urlsToDelete = [];

    // 1. Ambil ID gambar lama dari DB
    const oldImages = await Products_Variant_Images.findAll({
      where: { variant_id: variantId },
      transaction: t,
    });
    const oldImageIds = oldImages.map((img) => img.id);

    // 2. Ambil ID gambar yang "masih ada" dari request
    const newImageIds = imagesData
      .filter((img) => img.id) // Filter gambar yg punya ID (gambar lama)
      .map((img) => img.id);

    // 3. BUAT gambar baru (yang tidak punya ID)
    const imagesToCreate = imagesData.filter((img) => !img.id);
    if (imagesToCreate.length > 0) {
      await Products_Variant_Images.bulkCreate(
        imagesToCreate.map((img) => ({ ...img, variant_id: variantId })),
        { transaction: t }
      );
    }

    // 4. UPDATE gambar lama (misal: urutan thumbnail berubah)
    const imagesToUpdate = imagesData.filter((img) => img.id);
    for (const img of imagesToUpdate) {
      await Products_Variant_Images.update(
        { is_thumbnail: img.is_thumbnail }, // Update thumbnail
        { where: { id: img.id }, transaction: t }
      );
    }

    // 5. HAPUS gambar (ID lama yg tidak ada di request baru)
    const imageIdsToDelete = oldImageIds.filter(
      (id) => !newImageIds.includes(id)
    );
    if (imageIdsToDelete.length > 0) {
      // Ambil URL-nya dulu sebelum dihapus
      const imagesToDelete = oldImages.filter((img) =>
        imageIdsToDelete.includes(img.id)
      );
      urlsToDelete.push(...imagesToDelete.map((img) => img.image_url));

      // Hapus dari DB
      await Products_Variant_Images.destroy({
        where: { id: imageIdsToDelete },
        transaction: t,
      });
    }

    return urlsToDelete; // Kembalikan URL file yg harus dihapus dari disk
  }
  async updateProductInduk(productId, productIndukData) {
    // Cek jika ada data yang mau di-update
    if (Object.keys(productIndukData).length === 0) {
      throw new Error("No update data provided");
    }

    await Products.update(productIndukData, {
      where: { id: productId },
    });

    // Kembalikan data yang sudah di-update
    return await this.findProductById(productId);
  }
  async deleteProduct(id) {
    return await Products.destroy({
      where: { id: id },
    });
  }
}

module.exports = new ProductRepository();
