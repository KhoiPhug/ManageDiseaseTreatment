const express = require("express");
const router = express.Router();

const prescriptionController = require("../app/controllers//PrescriptionController");

router.get("/create", prescriptionController.createPrescription);
router.get("/getPrescription/:formId", prescriptionController.getPrescription);
router.put(
    "/update/:prescriptionId",
    prescriptionController.updatePrescription,
);

module.exports = router;
