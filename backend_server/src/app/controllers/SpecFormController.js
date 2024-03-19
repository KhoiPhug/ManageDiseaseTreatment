const SpecForm = require("../models/SpecForm");
const MEForm = require("../models/MEForm");
const Patient = require("../models/Patient");
const Person = require("../models/Person");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../utils/mongoose");

class SpecFormController {
    //[GET] /specform/create
    createSpecForm(req, res, next) {
        const specForm = new SpecForm({
            formId: 3,
            roomId: 1,
            personId: 3,
            patientId: 3,
            request: "request",
            overResult: "",
        });
        specForm
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(next);
    }

    //[GET] specform/getlist
    getList(req, res, next) {
        let mEFormQuery = MEForm.find({});
        let patientQuery = Patient.find({});
        let personQuery = Person.find({});
        let specFormQuery = SpecForm.find({});

        Promise.all([mEFormQuery, patientQuery, personQuery, specFormQuery])
            .then(([mEForms, patients, persons, specForms]) => {
                let data = specForms.map((specForm) => {
                    let newSpecForm = mongooseToObject(specForm);

                    mEForms.forEach((mEForm) => {
                        if (mEForm.formId === newSpecForm.formId) {
                            let { date, numOrder, reason } = mEForm;

                            newSpecForm = {
                                ...newSpecForm,
                                date: new Date(date),
                                numOrder,
                                reason,
                            };
                        }
                    });

                    patients.forEach((patient) => {
                        if (patient.patientId == newSpecForm.patientId) {
                            let { _id, name, address, phone, career, age } =
                                patient;

                            newSpecForm = {
                                ...newSpecForm,
                                patientName: patient.name,
                                patientPhone: patient.phone,
                                _patient: {
                                    _id,
                                    name,
                                    address,
                                    phone,
                                    career,
                                    age,
                                },
                            };
                        }
                    });

                    persons.forEach((person) => {
                        if (
                            person.job == "Specialist doctor" &&
                            person.personId == newSpecForm.personId
                        ) {
                            let { _id, personId, name } = person;

                            newSpecForm = {
                                ...newSpecForm,
                                _person: { _id, personId, name },
                            };
                        }
                    });
                    console.log(typeof newSpecForm.date);
                    return newSpecForm;
                });
                res.json(data);
            })
            .catch(next);
    }

    //[POST] specform/createMany
    createManyFrom(req, res, next) {
        const { formId, roomIds, request, patientId } = req.body;

        let specForms = [];
        roomIds.forEach((roomId) => {
            const specForm = new SpecForm({
                specFormId: `GF${formId}R${roomId}`,
                formId: formId,
                roomId,
                personId: -1,
                patientId: patientId,
                request: request,
                overResult: "",
            });

            specForms.push(specForm);
        });

        SpecForm.insertMany(specForms)
            .then(() => {
                next();
            })
            .catch(() => res.status(404));
    }

    //[PUT] specform/update/:id
    updateFrom(req, res, next) {
        const {
            formId,
            roomId,
            request,
            overResult,
            numOrder,
            personId,
            patientId,
            reason,
            _patient,
            date,
        } = req.body;

        const specForm = {
            formId: parseInt(formId),
            roomId: parseInt(roomId),
            personId,
            patientId: parseInt(patientId),
            request,
            overResult,
        };

        const patient = {
            address: _patient.address,
            age: _patient.age,
            career: _patient.career,
            name: _patient.name,
            phone: _patient.phone,
        };

        const mEForm = {
            numOrder,
            date: new Date(date),
            reason,
        };

        Promise.all([
            MEForm.updateOne({ formId: formId }, mEForm),
            Patient.updateOne({ _id: _patient._id }, patient),
            SpecForm.updateOne({ _id: req.params.id }, specForm),
        ])
            .then(([meformResult, patientResult, specFormResult]) => {
                res.status(201).json([
                    meformResult,
                    patientResult,
                    specFormResult,
                ]);
            })
            .catch(next);
    }

    //[DELETE] specform/delete/:id
    deleteForm(req, res, next) {
        SpecForm.delete({ _id: req.params.id })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    //[POST] specform/delete/selected
    deleteSelectedForm(req, res, next) {
        SpecForm.delete({ _id: { $in: req.body } })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    //[PATCH] specform/updateOverResult
    updateOverResult(req, res, next) {
        const { overResult, _id } = req.body;

        const specForm = {
            overResult,
        };

        SpecForm.updateOne({ _id }, specForm)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(next);
    }

    deleteFormNotExist(req, res, next) {}

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

module.exports = new SpecFormController();
