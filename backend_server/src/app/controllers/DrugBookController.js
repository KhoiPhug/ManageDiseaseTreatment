const DrugBook = require("../models/DrugBook");
const { multipleMongooseToObject } = require("../../utils/mongoose");
const Counter = require("../models/Counter");

class DrugBookController {
    // [GET] /home
    getList(req, res, next) {
        DrugBook.find({})
            .then((drugbooks) => {
                res.json(drugbooks);
            })
            .catch(next);
    }

    createDrugBook(req, res, next) {
        const {
            drugname,
            unit,
            unitprice,
            quantity,
            producer,
            type,
            quantityvend,
            datevend,
        } = req.body;

        const drugbook = new DrugBook({
            drugname: drugname,
            unit: unit,
            unitprice: unitprice,
            quantity: parseInt(quantity),
            producer: producer,
            type: type,
            quantityvend: quantityvend,
            datevend: new Date(datevend),
        });
        drugbook
            .save()
            .then(() => {
                res.status(201).json(drugbook);
            })
            .catch(next);
    }

    updateDrugBook(req, res, next) {
        const {
            drugname,
            unit,
            unitprice,
            quantity,
            producer,
            type,
            quantityvend,
            datevend,
        } = req.body;
        const drugbook = {
            drugname: drugname,
            unit: unit,
            unitprice: unitprice,
            quantity: parseInt(quantity),
            type: type,
            producer: producer,
            quantityvend: quantityvend,
            datevend: datevend,
        };
        DrugBook.updateOne({ _id: req.params.id }, drugbook)
            .then(() => {
                res.status(201).json(drugbook);
            })
            .catch(next);
    }
    deleteDrugBook(req, res, next) {
        DrugBook.delete({ _id: req.params.id })
            .then(() => {
                res.status(201).json({ message: "DELETE" });
            })
            .catch(next);
    }

    deleteSelectedDrugBook(req, res, next) {
        DrugBook.delete({ _id: { $in: req.body } })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    counterDrugBook(req, res, next) {
        Counter.findOne({ id: "drugbookID" })
            .then((data) => res.json(data))
            .catch(next);
    }
}
module.exports = new DrugBookController();
