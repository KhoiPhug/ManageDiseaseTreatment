const express = require("express");
const router = express.Router();

const roomController = require("../app/controllers/RoomController");

// router.get("/create", roomController.createRoom);
router.get("/getlist", roomController.getList);

module.exports = router;
