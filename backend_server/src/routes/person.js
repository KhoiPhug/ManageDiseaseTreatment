const express = require("express");
const router = express.Router();

const personController = require("../app/controllers/PersonController");

router.get("/api/create", personController.createPerson);
router.get("/getlisttoform", personController.getListToForm);
router.get("/getlisttospecform", personController.getListToSpecForm);
router.get("/getCurrentPerson/:accountId", personController.getCurrentPerson);
router.put("/updatePerson/:id", personController.updatePerson);

router.get("/stored/profile", personController.storedProfile);
router.get("/trash/profile", personController.trashProfile);
router.get("/create", personController.create);
router.post("/api/store", personController.store);
router.post("/handle-form-action", personController.handleFormAction);
router.get("/:id/edit", personController.edit);
router.put("/:id", personController.update);
router.patch("/:id/restore", personController.restore);
router.delete("/:id", personController.delete);
router.delete("/:id/force", personController.forceDelete);
router.get("/api/:phone", personController.apiShow);
router.get("/:phone", personController.show);

module.exports = router;
