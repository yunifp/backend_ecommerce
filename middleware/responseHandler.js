// middleware/responseHandler.js
"use strict";

const responseHandler = (req, res, next) => {
  /**
   * Mengirim respons sukses (HTTP 200-299)
   * @param {*} data - Data yang akan dikirim (objek, array, atau string)
   * @param {string} [message='Success'] - Pesan kustom
   * @param {number} [statusCode=200] - HTTP Status Code
   */
  res.success = (data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
      meta: {
        message: message,
        code: statusCode,
        status: "success",
      },
      data: data,
    });
  };

  /**
   * Mengirim respons gagal (HTTP 400-599)
   * @param {string} [message='Internal Server Error'] - Pesan error
   * @param {number} [statusCode=500] - HTTP Status Code
   */
  res.error = (message = "Internal Server Error", statusCode = 500) => {
    res.status(statusCode).json({
      meta: {
        message: message,
        code: statusCode,
        status: "fail", // atau 'error'
      },
      // Kita tidak kirim 'data' saat error
    });
  };

  next(); // Lanjut ke middleware atau router berikutnya
};

module.exports = responseHandler;
