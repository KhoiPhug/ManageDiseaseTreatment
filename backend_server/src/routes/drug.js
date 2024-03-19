const express = require("express");
const router = express.Router();

const DrugController = require("../app/controllers/DrugController");

router.get("/getlist", DrugController.getList);
router.get("/counter/drug", DrugController.counterDrug);
router.post("/create",DrugController.createDrug);
router.get("/create",DrugController.createDrug);
router.put("/update/:id",DrugController.updateDrug);
router.delete("/delete/:id",DrugController.deleteDrug);
router.post("/delete/selected", DrugController.deleteSelectedDrug);

module.exports = router;
