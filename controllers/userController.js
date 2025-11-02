// controllers/userController.js
const userService = require("../services/userService");

class UserController {
  // Create
  async createUser(req, res) {
    try {
      // Lempar 'req.user' dari middleware ke service
      const user = await userService.createUser(req.body, req.user);
      res.success(user, "User created successfully", 201);
    } catch (error) {
      // Jika error 'Forbidden', kirim 403
      if (error.message.startsWith("Forbidden:")) {
        return res.error(error.message, 403);
      }
      res.error(error.message, 400);
    }
  }

  // Read (One)
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.success(user, "User retrieved successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }

  // Update
  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.success(user, "User updated successfully");
    } catch (error) {
      res.error(error.message, 400); // 400 Bad Request
    }
  }

  // Delete
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      // Kita bisa kirim data null
      res.success(null, "User deleted successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }
}

module.exports = new UserController();
