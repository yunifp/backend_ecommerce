// middleware/tryAuthenticate.js
const jwt = require("jsonwebtoken");

// Middleware ini mirip 'authenticate', tapi 'opsional'
// Tidak melempar error jika tidak ada token

const tryAuthenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(); // Tidak ada token? Tidak masalah, lanjut saja
  }

  try {
    // Ada token, coba verifikasi
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload; // Sukses, isi req.user
  } catch (error) {
    // Token ada tapi invalid? Tidak masalah, lanjut saja
  }

  next();
};

module.exports = tryAuthenticate;
