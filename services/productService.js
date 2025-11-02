// services/productService.js
// services/productService.js
const productRepository = require('../repositories/productRepository');
const sharp = require('sharp'); // <-- 1. IMPORT SHARP
const path = require('path');   // <-- 2. IMPORT PATH
const fs = require('fs');       // <-- 3. IMPORT FS (File System)
const crypto = require('crypto'); // <-- 4. IMPORT CRYPTO (untuk nama file unik)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
class ProductService {
  async createProduct(body, files) {
    const {
      name,
      slug,
      description,
      category_id,
      weight_grams,
      is_featured,
      variants: variantsJSON,
    } = body;

    // 1. Validasi dasar
    if (!name || !slug || !category_id || !variantsJSON) {
      throw new Error(
        "Name, slug, category_id, and variants JSON string are required"
      );
    }

    // 2. Parse string JSON varian
    let variantsData;
    try {
      variantsData = JSON.parse(variantsJSON);
    } catch (e) {
      throw new Error("Invalid JSON string for variants");
    }

    if (!Array.isArray(variantsData) || variantsData.length === 0) {
      throw new Error("Variants must be a non-empty array");
    }

    // 3. Rakit datanya: Petakan file ke varian yang benar
    const assembledVariants = await Promise.all(
      variantsData.map(async (variant, index) => {
        const keyName = `variant_${index}_images`;
        const filesForThisVariant = files.filter(
          (file) => file.fieldname === keyName
        );

        if (filesForThisVariant.length === 0) {
          throw new Error(`No images found for variant index ${index}`);
        }

        // --- INI LOGIKA BARU MENGGUNAKAN SHARP ---
        const images = await Promise.all(
          filesForThisVariant.map(async (file) => {
            // a. Buat nama file unik dengan ekstensi .webp
            const filename = crypto.randomBytes(16).toString("hex") + ".webp";

            // b. Tentukan path lengkap untuk menyimpan file
            const outputPath = path.join(uploadDir, filename);

            // c. Proses dengan Sharp:
            await sharp(file.buffer) // Ambil buffer dari RAM
              .webp({ quality: 80 }) // Konversi ke WebP, kualitas 80%
              .toFile(outputPath); // Simpan ke disk

            // d. Kembalikan URL publik
            return {
              image_url: `/uploads/${filename}`, // URL yang disimpan di DB
              is_thumbnail: false,
            };
          })
        );
        // --- SELESAI LOGIKA BARU ---

        // Set gambar thumbnail pertama
        if (images.length > 0) {
          images[0].is_thumbnail = true;
        }

        return {
          ...variant,
          images: images,
        };
      })
    );

    // 4. Buat objek produk final
    const productData = {
      name,
      slug,
      description,
      category_id,
      weight_grams,
      is_featured,
      variants: assembledVariants,
    };

    // 5. Kirim ke repository (repository tidak tahu-menahu soal 'files')
    return await productRepository.createProduct(productData);
  }

  async getAllProducts() {
    return await productRepository.findAllProducts();
  }

  async getProductById(id) {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async updateProduct(productId, body, files) {
    // 1. Cek dulu produknya
    const existingProduct = await productRepository.findProductById(productId);
    if (!existingProduct) throw new Error("Product not found");

    const {
      name,
      slug,
      description,
      category_id,
      weight_grams,
      is_featured,
      variants: variantsJSON,
    } = body;

    // --- LOGIKA "PINTAR" DIMULAI ---

    // 2. Jika 'variantsJSON' DIKIRIM (Update Penuh / Ganti Varian)
    if (variantsJSON) {
      let variantsData;
      try {
        variantsData = JSON.parse(variantsJSON);
      } catch (e) {
        throw new Error("Invalid JSON string for variants");
      }
      if (!Array.isArray(variantsData))
        throw new Error("Variants must be an array");

      // 3. Rakit data: Petakan file ke varian yang benar
      const assembledVariants = await Promise.all(
        variantsData.map(async (variant, index) => {
          // Tentukan 'fieldname' untuk file baru
          const keyName = variant.id
            ? `variant_${variant.id}_images` // Varian lama: cth. variant_1_images
            : `variant_new_${index}_images`; // Varian baru: cth. variant_new_0_images

          const filesForThisVariant = files.filter(
            (file) => file.fieldname === keyName
          );

          // Ambil array 'images' lama (dari JSON)
          // Ini adalah gambar yg *tidak* dihapus user di frontend
          let images = variant.images || [];

          // Proses file BARU (jika ada)
          if (filesForThisVariant.length > 0) {
            const newImages = await Promise.all(
              filesForThisVariant.map(async (file) => {
                const filename =
                  crypto.randomBytes(16).toString("hex") + ".webp";
                const outputPath = path.join(uploadDir, filename);

                await sharp(file.buffer)
                  .webp({ quality: 80 })
                  .toFile(outputPath);

                // Ini gambar BARU (tanpa ID)
                return {
                  image_url: `/uploads/${filename}`,
                  is_thumbnail: false,
                };
              })
            );
            // Gabungkan gambar lama (dari JSON) + gambar baru (dari file)
            images = [...images, ...newImages];
          }

          if (images.length === 0) {
            throw new Error(`No images provided for variant (index ${index})`);
          }

          // Set thumbnail (gambar pertama di array)
          images.forEach((img, i) => (img.is_thumbnail = i === 0));

          return {
            ...variant, // (id?, color, size, price, stock)
            images: images, // (array gabungan gambar lama [id-nya] + gambar baru)
          };
        })
      );

      const fullProductData = {
        name,
        slug,
        description,
        category_id,
        weight_grams,
        is_featured,
        variants: assembledVariants,
      };

      // Kirim ke repository untuk "Diffing"
      return await productRepository.updateProduct(productId, fullProductData);
    } else {
      // 3. Jika 'variantsJSON' TIDAK DIKIRIM (Update Parsial / Ganti Nama Saja)
      const productIndukData = {};
      if (name) productIndukData.name = name;
      if (slug) productIndukData.slug = slug;
      if (description) productIndukData.description = description;
      if (category_id) productIndukData.category_id = category_id;
      if (weight_grams) productIndukData.weight_grams = weight_grams;
      if (is_featured !== undefined) productIndukData.is_featured = is_featured;

      return await productRepository.updateProductInduk(
        productId,
        productIndukData
      );
    }
  }

  async deleteProduct(id) {
    // 1. Ambil data produk LENGKAP (termasuk URL gambar) SEBELUM dihapus
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // 2. Kumpulkan semua URL gambar yang akan dihapus
    const urlsToDelete = [];
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          for (const image of variant.images) {
            urlsToDelete.push(image.image_url);
          }
        }
      }
    }

    // 3. Hapus data dari Database
    // (Repository `deleteProduct` hanya akan menjalankan 'destroy')
    // 'onDelete: CASCADE' di DB akan membersihkan tabel variants & images
    await productRepository.deleteProduct(id);

    // 4. (Setelah DB sukses) Hapus file fisik dari disk
    for (const url of urlsToDelete) {
      if (!url) continue; // Lewati jika URL-nya null/kosong

      // Hapus '/' di depan (cth: '/uploads/file.webp' -> 'uploads/file.webp')
      // Ini perbaikan bug 'ENOENT' kita sebelumnya
      const relativeUrl = url.startsWith("/") ? url.substring(1) : url;
      const filePath = path.join(__dirname, "..", relativeUrl);

      fs.unlink(filePath, (err) => {
        if (err) {
          // Jangan gagalkan request, cukup log di server
          console.error(`Failed to delete file from disk: ${filePath}`, err);
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    }

    // Kembalikan sukses (karena data DB sudah terhapus)
    return { message: "Product deleted successfully" };
  }
}

module.exports = new ProductService();
