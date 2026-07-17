const express = require("express");
const router = express.Router();
const aiController = require("./ai.controller");
const authenticate = require("../../middlewares/authMiddleware");

router.use(authenticate);
router.post("/suggest", aiController.suggestDescription);

module.exports = router;