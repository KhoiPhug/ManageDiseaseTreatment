const express = require("express");
const router = express.Router();

const CreateSpecFormMiddleware = require("../app/middleware/CreateSpecFormMiddleware");
const DeleteSpecFormMiddleware = require("../app/middleware/DeleteSpecFormMiddleware");
const GetRoomIdsInSpecFormMiddleware = require("../app/middleware/GetRoomIdsInSpecFormMiddleware");
const specFormController = require("../app/controllers/SpecFormController");

router.get("/create", specFormController.createSpecForm);
router.put("/update/:id", specFormController.updateFrom);
router.patch("/updateOverResult", specFormController.updateOverResult);
router.post(
    "/createMany",
    CreateSpecFormMiddleware,
    GetRoomIdsInSpecFormMiddleware,
    DeleteSpecFormMiddleware,
    specFormController.createManyFrom,
);
router.get("/getlist", specFormController.getList);
router.post("/delete/selected", specFormController.deleteSelectedForm);
router.delete("/delete/:id", specFormController.deleteForm);

module.exports = router;
