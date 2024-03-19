const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Prescription = new Schema(
    {
        prescriptionId: {type: String, maxLength: 8}, //PROFGF{formId}
        formId: {type: Number},
        patientId: {type: Number},
        status: {type: Boolean, default: false},
        total: {type: Number},
        drugIds: {type: Array}
    },
    {
        timestamps: true,
    },
);

//App plugin
Prescription.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
// Prescription.plugin(AutoIncrement, {inc_field: 'PrescriptionId'});

module.exports = mongoose.model("prescriptions", Prescription);
