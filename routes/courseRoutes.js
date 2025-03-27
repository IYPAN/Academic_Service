const express = require("express");
const { createCourse, deleteCourse } = require("../controllers/courseController.js");
const authenticate = require("../config/authMiddleware.js");

const router = express.Router();

router.post("/", authenticate("academi"), createCourse);
router.delete("/:id", authenticate("academic"), deleteCourse);

module.exports = router;