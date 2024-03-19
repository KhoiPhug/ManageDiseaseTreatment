const express = require("express");
const router = express.Router();

const DrugBookController = require("../app/controllers/DrugBookController");

router.get("/getlist", DrugBookController.getList);
router.get("/counter/drugbook", DrugBookController.counterDrugBook);
router.post("/create",DrugBookController.createDrugBook);
router.get("/create",DrugBookController.createDrugBook);
router.put("/update/:id",DrugBookController.updateDrugBook);
router.delete("/delete/:id",DrugBookController.deleteDrugBook);
router.post("/delete/selected", DrugBookController.deleteSelectedDrugBook);


module.exports = router;
