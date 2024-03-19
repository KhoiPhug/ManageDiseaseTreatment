const Room = require("../models/Room");
const Exam = require("../models/Exam");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../utils/mongoose");

class ExamController {
    //[GET] /exam/create
    createRoom(req, res, next) {
        const exam = new Exam({
            specFormId: "GF3R2",
            temperature: 29,
            sysBloodPressure: 100,
            diasBloodPressure: 60,
            breathing: 30,
            pulse: 30,
            height: 170,
            weight: 30,
            note: "",
        });
        exam.save()
            .then((data) => {
                res.status(201).json(exam);
            })
            .catch(next);
    }

    //[GET] /exam/getExam/:specFormId
    getExam(req, res, next) {
        Exam.findOne({ specFormId: req.params.specFormId })
            .then((exam) => {
                res.json(exam);
            })
            .catch(next);
    }

    //[POST] /exam/create
    createExam(req, res, next) {
        const {
            specFormId,
            temperature,
            sysBloodPressure,
            diasBloodPressure,
            breathing,
            pulse,
            height,
            weight,
            note,
        } = req.body;

        const exam = new Exam({
            specFormId: specFormId,
            temperature: parseInt(temperature),
            sysBloodPressure: parseInt(sysBloodPressure),
            diasBloodPressure: parseInt(diasBloodPressure),
            breathing: parseInt(breathing),
            pulse: parseInt(pulse),
            height: parseInt(height),
            weight: parseInt(weight),
            note: note,
        });

        exam.save()
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    //[PUT] /exam/update/:id
    updateExam(req, res, next) {
        const {
            specFormId,
            temperature,
            sysBloodPressure,
            diasBloodPressure,
            breathing,
            pulse,
            height,
            weight,
            note,
        } = req.body;

        const exam = {
            specFormId: specFormId,
            temperature: parseInt(temperature),
            sysBloodPressure: parseInt(sysBloodPressure),
            diasBloodPressure: parseInt(diasBloodPressure),
            breathing: parseInt(breathing),
            pulse: parseInt(pulse),
            height: parseInt(height),
            weight: parseInt(weight),
            note: note,
        };

        Exam.updateOne({ _id: req.params.id }, exam)
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

module.exports = new ExamController();
