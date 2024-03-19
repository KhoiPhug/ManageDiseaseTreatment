const Room = require("../models/Room");
const Exam = require("../models/Exam");
const UltrasoundResult = require("../models/UltrasoundResult");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../utils/mongoose");

class UltrasoundResultController {
    //[GET] /ultrasoundResult/create
    createUltrasoundResult(req, res, next) {
        const ultrasoundResult = new UltrasoundResult({
            specFormId: "GF3R2",
            result: "example",
            conclusion: "example",
            images: [
                {
                    itemImageSrc:
                        "https://primereact.org/images/galleria/galleria1.jpg",
                    thumbnailImageSrc:
                        "https://primereact.org/images/galleria/galleria1s.jpg",
                    alt: "Description for Image 1",
                    title: "Title 1",
                },
                {
                    itemImageSrc:
                        "https://primereact.org/images/galleria/galleria2.jpg",
                    thumbnailImageSrc:
                        "https://primereact.org/images/galleria/galleria2s.jpg",
                    alt: "Description for Image 2",
                    title: "Title 2",
                },
            ],
        });
        ultrasoundResult
            .save()
            .then((data) => {
                res.status(201).json(ultrasoundResult);
            })
            .catch(next);
    }

    //[GET] /ultrasoundResult/getUltrasoundResult/:specFormId
    getUltrasoundResult(req, res, next) {
        UltrasoundResult.findOne({ specFormId: req.params.specFormId })
            .then((ultrasoundResult) => {
                res.json(ultrasoundResult);
            })
            .catch(next);
    }

    //[POST] /ultrasoundResult/create
    createUltrasoundResult(req, res, next) {
        const { result, conclusion, specFormId } = req.body;

        const ultrasoundResult = new UltrasoundResult({
            specFormId,
            result,
            conclusion,
        });

        ultrasoundResult
            .save()
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    //[PUT] /ultrasoundResult/update/:id
    updateUltrasoundResult(req, res, next) {
        const { result, conclusion } = req.body;

        const ultrasoundResult = {
            result,
            conclusion,
        };

        UltrasoundResult.updateOne({ _id: req.params.id }, ultrasoundResult)
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

module.exports = new UltrasoundResultController();
