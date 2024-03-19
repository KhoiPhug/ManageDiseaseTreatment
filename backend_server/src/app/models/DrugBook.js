const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const DrugBook = new Schema(
    {
        drugname: { type: String, maxLength: 255  },
        unit: { type: String, maxLength: 255 },
        unitprice: { type: String, maxLength: 255 },
        quantity: { type: Number },
        producer: { type: String, maxLength: 255 },
        type: {type: String, maxLength: 255},
        quantityvend: {type: Number},
        datevend: { type: Date, default: Date.now() },

    },
    {
        timestamps: true,
    },
);

//App plugin
DrugBook.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
DrugBook.plugin(AutoIncrement, {inc_field: 'drugbookID'});

module.exports = mongoose.model("drugbooks", DrugBook);
