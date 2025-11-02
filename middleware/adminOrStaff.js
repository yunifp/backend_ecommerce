// middleware/adminOrStaff.js

const adminOrStaff = (req, res, next) => {
  // Kita asumsikan 'authenticate' sudah berjalan
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    // Jika dia admin ATAU staff, izinkan lanjut
    next();
  } else {
    // 403 Forbidden
    return res.error("Forbidden: Admin or Staff access required", 403);
  }
};

module.exports = adminOrStaff;
