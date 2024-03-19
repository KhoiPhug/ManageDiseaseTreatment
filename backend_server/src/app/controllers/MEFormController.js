const MEForm = require("../models/MEForm");
const Patient = require("../models/Patient");
const Person = require("../models/Person");
const Counter = require("../models/Counter");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../utils/mongoose");

class MEFormController {
    //[GET] meform/getlist
    getList(req, res, next) {
        let mEFormQuery = MEForm.find({});
        let patientQuery = Patient.find({});
        let personQuery = Person.find({});

        Promise.all([mEFormQuery, patientQuery, personQuery])
            .then(([mEForms, patients, persons]) => {
                let data = mEForms.map((mEForm) => {
                    let newMEForm = mongooseToObject(mEForm);
                    patients.forEach((patient) => {
                        if (patient.patientId == newMEForm.patientId) {

                            let {_id,name,address,phone,career,age} = patient;

                            newMEForm = {
                                ...newMEForm,
                                patientName: patient.name,
                                patientPhone: patient.phone,
                                date: new Date(newMEForm.date),
                                _patient: {_id,name,address,phone,career,age},
                            };
                        }
                    });

                    persons.forEach((person) => {
                        if (person.job == "General doctor" && person.personId == newMEForm.personId) {
                            let {_id , personId ,name} = person;

                            newMEForm = {
                                ...newMEForm,
                                _person: {_id,personId, name},
                            };
                        }
                    });
                    console.log(typeof newMEForm.date);
                    return newMEForm;
                });
                res.json(data);
            })
            .catch(next);
    }

    //[POST] meform/create
    createFrom(req, res, next) {
        const {numOrder, personId, patientId, reason,_patient, date, roomIds} = req.body;
        const {address, career, age, phone, name} = _patient

        const mEform = new MEForm({
            numOrder: numOrder,
            personId: personId,
            patientId: patientId,
            date: date,
            reason: reason,
            roomIds: roomIds,
        });

        const patient = new Patient({
            id: 1,
            address: address,
            career: career,
            age: age,
            phone: phone,
            name: name,
        })
        
        Promise.all([mEform.save(), patient.save()])
            .then(([newMEForm, newPatient]) => {
                res.status(201).json([newMEForm, newPatient]);
            })
            .catch(next);
    }

    //[PUT] meform/update/:id
    updateFrom(req, res, next) {
        const { numOrder, personId, patientId, reason, _patient, date, roomIds } = req.body;

        const mEform = {
            numOrder: parseInt(numOrder),
            personId: parseInt(personId),
            patientId: parseInt(patientId),
            date: date,
            reason: reason,
            roomIds: roomIds,
        };

        const patient = {
            address: _patient.address,
            age: _patient.age,
            career: _patient.career,
            name: _patient.name,
            phone: _patient.phone,
        }

        MEForm.updateOne({ _id: req.params.id }, mEform)

        Promise.all([MEForm.updateOne({ _id: req.params.id }, mEform), Patient.updateOne({_id : _patient._id},patient)])
            .then(([meformResult, patientResult]) => {
                res.status(201).json([meformResult, patientResult]);
            })
            .catch(next);
    }

    //[GET] meform/api/:formId
    apiShow(req, res, next) {
        MEForm.findOne({ formId: req.params.formId })
            .then((person) => {
                res.json(person);
            })
            .catch(next);
    }

    //[DELETE] meform/delete/:id
    deleteForm(req, res, next) {
        MEForm.delete({ _id: req.params.id })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    //[POST] meform/delete/selected
    deleteSelectedForm(req, res, next) {
        MEForm.delete({ _id: { $in: req.body } })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    //[GET] meform/counter/form
    counterForm(req,res,next){
        Counter.find({ id: { $in: ["formId", "patientId"]} })
            .then((data) => {
                let mEForm, patient;
                data.forEach((item) => {
                    if(item.id === "formId")
                        mEForm = item;
                    else patient = item
                }) 
                res.json({mEForm,patient})
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

module.exports = new MEFormController();
