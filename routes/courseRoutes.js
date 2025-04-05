const express = require("express");
const { createCourse, deleteCourse } = require("../controllers/courseController.js");
const authenticate = require("../config/authMiddleware.js");

const router = express.Router();

router.post("/", authenticate("manager"), createCourse);
router.delete("/:id", authenticate("manager"), deleteCourse);

module.exports = router;