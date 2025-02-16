const express = require("express");
const { createBatch, getBatches, getBatchById, updateBatch, deleteBatch } = require("../controllers/batchController.js");
const  authenticate = require("../config/authMiddleware.js");

const router = express.Router();

router.post("/", authenticate("academic"), createBatch);
router.get("/", authenticate("academic"), getBatches);
router.get("/:id", authenticate("academic"), getBatchById);
router.put("/:id", authenticate("academic"), updateBatch);
router.delete("/:id", authenticate("academic"), deleteBatch);

module.exports = router;


