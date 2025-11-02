// middleware/authenticate.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // 1. Ambil token dari cookie yang sudah diparsing
  const token = req.cookies.token;

  // 2. Cek jika tidak ada token
  if (!token) {
    // 401 Unauthorized
    return res.error("Unauthorized: No token provided", 401);
  }

  try {
    // 3. Verifikasi token
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. PENTING: Simpan data user di 'req' untuk dipakai controller
    req.user = decodedPayload; // Ini akan berisi { id, email, role }

    // 5. Lanjut ke middleware/controller berikutnya
    next();
  } catch (error) {
    // Jika token tidak valid atau expired
    return res.error("Unauthorized: Invalid token", 401);
  }
};

module.exports = authenticate;
