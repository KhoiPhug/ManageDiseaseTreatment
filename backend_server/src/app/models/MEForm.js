const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const MEForm = new Schema(
    {
        numOrder: { type: Number },
        personId: { type: Number },
        patientId: { type: Number },
        date: { type: Date, default: Date.now() },
        reason: { type: String, maxLength: 600 },
        roomIds: { type: Array },
    },
    {
        timestamps: true,
    },
);

//App plugin
MEForm.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
MEForm.plugin(AutoIncrement, {inc_field: 'formId'});

module.exports = mongoose.model("meforms", MEForm);
