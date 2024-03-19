const express = require("express");
const router = express.Router();

const examController = require("../app/controllers/ExamController");

router.get("/create", examController.createRoom);
router.get("/getExam/:specFormId", examController.getExam);
router.post("/create", examController.createExam);
router.put("/update/:id", examController.updateExam);

module.exports = router;
