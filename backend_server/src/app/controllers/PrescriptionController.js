const Room = require("../models/Room");
const Prescription = require("../models/Prescription");
const { multipleMongooseToObject } = require("../../utils/mongoose");

class PrescriptionController {
    //[GET] /prescription/create
    createPrescription(req, res, next) {
        const prescription = new Prescription({
            prescriptionId: "PREOFGF3",
            formId: 3,
            patientId: 3,
            total: 0,
            drugIds: [],
        });
        prescription
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(next);
    }

    //[GET] /prescription/getPrescription/:formId
    getPrescription(req, res, next) {
        Prescription.findOne({ formId: req.params.formId })
            .then((prescription) => {
                res.json(prescription);
            })
            .catch(next);
    }

    //[PUT] /prescription/update/:prescriptionId
    updatePrescription(req, res, next) {
        const { drugIds } = req.body;

        const prescription = {
            drugIds,
        };

        Prescription.updateOne(
            { prescriptionId: req.params.prescriptionId },
            prescription,
        )
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    // // [GET] /home
    // index(req, res, next) {
    //     Person.find({})
    //         .then((persons) =>
    //             res.render('home', {
    //                 persons: multipleMongooseToObject(persons),
    //             }),
    //         )
    //         .catch(next);
    // }
    // // [GET] /api/home
    // apiIndex(req, res, next) {
    //     Person.find({})
    //         .then((persons) => res.json(persons))
    //         .catch(next);
    // }
    // // [GET] /search
    // search(req, res) {
    //     res.render('search');
    // }
}

module.exports = new PrescriptionController();
