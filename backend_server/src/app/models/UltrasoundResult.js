const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const UltrasoundResult = new Schema(
    {
        specFormId: {type: String},
        result: {type: String},
        conclusion: {type: String},
        images: {type: Array},
    },
    {
        timestamps: true,
    },
);

//App plugin
UltrasoundResult.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
// UltrasoundResult.plugin(AutoIncrement, {inc_field: 'UltrasoundResultId'});

module.exports = mongoose.model("ultrasoundResults", UltrasoundResult);
