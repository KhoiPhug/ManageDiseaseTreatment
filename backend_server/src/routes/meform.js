const express = require("express");
const router = express.Router();

const mEFormController = require("../app/controllers/MEFormController");

router.put("/update/:id", mEFormController.updateFrom);
router.get("/getlist", mEFormController.getList);
router.get("/counter/form", mEFormController.counterForm);
router.get("/api/:formId", mEFormController.apiShow);
router.post("/create", mEFormController.createFrom);
router.post("/delete/selected", mEFormController.deleteSelectedForm);
router.delete("/delete/:id", mEFormController.deleteForm);

module.exports = router;
