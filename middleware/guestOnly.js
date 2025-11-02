// middleware/guestOnly.js
const jwt = require("jsonwebtoken");

const guestOnly = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // 1. Bagus, tidak ada token. Dia adalah 'guest'. Izinkan lanjut.
    return next();
  }

  try {
    // 2. Ada token, coba verifikasi
    jwt.verify(token, process.env.JWT_SECRET);

    // 3. Jika VERIFIKASI SUKSES, berarti dia sudah login.
    // Kita BLOKIR dia.
    return res.error("Bad Request: You are already logged in", 400);
  } catch (error) {
    // 4. Jika token ada tapi TIDAK VALID (expired, dll)
    // Anggap saja dia 'guest'. Izinkan lanjut.
    return next();
  }
};

module.exports = guestOnly;
