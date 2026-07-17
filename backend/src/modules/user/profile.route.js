const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const authenticate = require("../../middlewares/authMiddleware");

router.use(authenticate);

router.get("/", profileController.getProfile);
router.patch("/username", profileController.updateUsername);
router.patch("/password", profileController.changePassword);

module.exports = router;