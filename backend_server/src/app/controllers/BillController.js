const Bill = require("../models/Bill");
const { multipleMongooseToObject } = require("../../utils/mongoose");
const Counter = require("../models/Counter");
class BillController {
    // [GET] /home
    getList(req, res, next) {
        Bill.find({})
            .then((bills) => {
                res.json(bills);
            })
            .catch(next);
    }

    createBill(req, res, next){

        const {

            drugname,
            unit,
            unitprice,
            quantity,
            amount,
            status,
            total,
            time,
        
        } = req.body;

        const bill = new Bill({
            drugname:  drugname ,
            unit: unit,
            unitprice: unitprice,
            quantity: quantity,
            amount: amount,
           // status: status,
            total: total,
            time: time,
        });
        bill
            .save()
            .then(() => {res.status(201).json(bill)})
            .catch(next);
    }

    updateBill(req, res, next){
        const {
            drugname,
            unit,
            unitprice,
            quantity,
            amount,
            //status,
            total,
        } = req.body;
        const bill = {
            drugname:  drugname ,
            unit: unit,
            unitprice: unitprice,
            quantity: quantity,
            amount: amount,
            //status: status,
            total: total,
        };
        Bill.updateOne({_id: req.params.id},bill)
            .then(() => {res.status(201).json(bill)})
            .catch(next);
    }
    deleteBill(req, res, next){
        Bill.delete({_id: req.params.id})
            .then(() => {res.status(201).json({message:"DELETE"})})
            .catch(next);
    }

    deleteSelectedBill(req, res, next) {
        Bill.delete({ _id: { $in: req.body } })
            .then(() => res.status(201).json({ message: "DELETED" }))
            .catch(next);
    }

    counterBill(req,res,next){
        Counter.findOne({ id: "billID" })
        .then((data) => res.json(data))
        .catch(next);
    }
}
module.exports = new BillController();
