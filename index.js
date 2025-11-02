// index.js (File Utama)
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const responseHandler = require("./middleware/responseHandler");
const path = require("path");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");
const corsOptions = {
  // origin: menentukan URL mana yang boleh request
  origin: function (origin, callback) {
    // Izinkan jika (origin ada di daftar) ATAU (jika 'origin' undefined, cth: request dari Postman)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },

  // credentials: true WAJIB ada agar browser mau
  // mengirim HttpOnly Cookie (token JWT kita)
  credentials: true,
};

// 1. PENTING: Middleware untuk membaca JSON (req.body)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseHandler);

// 2. Import Router Utama
const mainRouter = require("./routes/index");

// 3. Daftarkan Router Utama dengan prefix /api/v1
app.use("/api/v1", mainRouter);

// 4. Root endpoint untuk tes
app.get("/", (req, res) => {
  res.send("API E-commerce Panjat Tebing v1.0");
});

// 5. Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
