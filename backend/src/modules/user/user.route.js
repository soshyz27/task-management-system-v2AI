const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authenticate = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/authorize");

// Tất cả route user đều cần authenticate + authorize("admin")
router.use(authenticate, authorize("admin"));

router.get("/", userController.getAllUsers);
router.patch("/:id/role", userController.updateUserRole);
router.delete("/:id", userController.deleteUser);

module.exports = router;