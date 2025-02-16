const express = require("express");
const { createBatch, getBatches, getBatchById, updateBatch, deleteBatch } = require("../controllers/batchController.js");
const { authenticate } = require("../config/authMiddleware.js");

const router = express.Router();

router.post("/", authenticate, createBatch);
router.get("/", authenticate, getBatches);
router.get("/:id", authenticate, getBatchById);
router.put("/:id", authenticate, updateBatch);
router.delete("/:id", authenticate, deleteBatch);

module.exports = router;


