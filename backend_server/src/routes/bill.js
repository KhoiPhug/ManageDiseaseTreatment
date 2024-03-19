const express = require("express");
const router = express.Router();

const BillController = require("../app/controllers/BillController");

router.get("/getlist", BillController.getList);
router.get("/counter/bill", BillController.counterBill);
router.post("/create",BillController.createBill);
router.get("/create",BillController.createBill);
router.put("/update/:id",BillController.updateBill);
router.delete("/delete/:id",BillController.deleteBill);
router.post("/delete/selected", BillController.deleteSelectedBill);

module.exports = router;
