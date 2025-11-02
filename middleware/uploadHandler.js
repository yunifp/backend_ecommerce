// middleware/uploadHandler.js
const multer = require("multer");

// 1. Ganti ke memoryStorage
// Ini akan menyimpan file sebagai 'buffer' di RAM (req.files[].buffer)
const storage = multer.memoryStorage();

// 2. Filter File (Ini tetap sama)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Terima file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, or GIF allowed."), false); // Tolak file
  }
};

// 3. Inisialisasi Multer
const upload = multer({
  storage: storage, // <-- UBAH DI SINI
  limits: {
    fileSize: 1024 * 1024 * 10, // Naikkan batas ke 10MB (karena buffer)
  },
  fileFilter: fileFilter,
});

module.exports = upload;
