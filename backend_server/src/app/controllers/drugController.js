const Drug = require("../models/Drug");
const { multipleMongooseToObject } = require("../../utils/mongoose");
const Counter = require("../models/Counter");
class DrugController {
    // [GET] /home
    getList(req, res, next) {
        Drug.find({})
            .then((drugs) => {
                res.json(drugs);
            })
            .catch(next);
    }

    createDrug(req, res, next){

        // const {

        //     drugname,
        //     unit,
        //     quantity,
        //     producer,
        
        // } = req.body;

        const drug = new Drug({
            drugname: "Throat",
            unit: "Viên",
            quantity: "200",
            producer: "Bách Thắng company"
        });
        drug
            .save()
            .then(() => {res.status(201).json(drug)})
            .catch(next);
    }

    updateDrug(req, res, next){
        const {
            drugname,
            unit,
            quantity,
            producer,

        } = req.body;
        const drug = {
            drugname:  drugname ,
            unit: unit,
            quantity: quantity,
            producer: producer,
        };
        Drug.updateOne({_id: req.params.id},drug)
            .then(() => {res.status(201).json(drug)})
            .catch(next);
    }
    deleteDrug(req, res, next){
        Drug.delete({_id: req.params.id})
            .then(() => {res.status(201).json({message:"DELETE"})})
            .catch(next);
    }

    deleteSelectedDrug(req, res, next) {
        Drug.delete({ _id: { $in: req.body } })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    counterDrug(req,res,next){
        Counter.findOne({ id: "drugID" })
        .then((data) => res.json(data))
        .catch(next);
    }
}
module.exports = new DrugController();
