const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Exam = new Schema(
    {
        specFormId: {type: String},
        temperature: {type: Number},
        sysBloodPressure: {type: Number},
        diasBloodPressure: {type: Number},
        breathing: {type: Number},
        pulse: {type: Number},
        height: {type: Number},
        weight: {type: Number},
        note: {type: String},
    },
    {
        timestamps: true,
    },
);

//App plugin
Exam.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
// Exam.plugin(AutoIncrement, {inc_field: 'ExamId'});

module.exports = mongoose.model("exams", Exam);
