// middleware/adminOnly.js

const adminOnly = (req, res, next) => {
  // Kita asumsikan 'authenticate' sudah berjalan dan mengisi 'req.user'

  if (req.user && req.user.role === "admin") {
    // Jika dia admin, izinkan lanjut
    next();
  } else {
    // 403 Forbidden (Dilarang, kamu login tapi bukan admin)
    return res.error("Forbidden: Admin access required", 403);
  }
};

module.exports = adminOnly;
