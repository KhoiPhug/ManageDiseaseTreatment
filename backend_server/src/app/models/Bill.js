const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Bill = new Schema(
    {
        drugname: { type: String, maxLength: 255  },
        unit: { type: String, maxLength: 255 },
        unitprice: { type: String, maxLength: 255 },
        quantity: { type: Number },
        amount: { type: Number},
       // status: { type: String, maxLength: 255 },
        total: { type: Number},
        time: { type: Date, default: Date.now() },

    },
    {
        timestamps: true,
    },
);

//App plugin
Bill.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
Bill.plugin(AutoIncrement, {inc_field: 'billID'});

module.exports = mongoose.model("bills", Bill);
