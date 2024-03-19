const Patient = require('../models/Patient');
const { multipleMongooseToObject } = require('../../utils/mongoose');

class PatientController {

    //[GET] /patient/create
    createPatient(req,res,next){

        const patient = new Patient({
            id: 2,
            address: "District 2, Hồ Chí Minh city",
            career: "Playwright",
            age: 30,
            phone: "0987443949",
            name: "Võ Quân",
        });
        patient
            .save()
            .then((data) => {
                res.status(201).json(data);
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

module.exports = new PatientController();
