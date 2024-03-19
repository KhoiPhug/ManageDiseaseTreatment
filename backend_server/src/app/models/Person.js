const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Person = new Schema(
    {
        id: { type: Number},
        accountId: { type: Number },
        name: { type: String, maxLength: 255 },
        address: { type: String, maxLength: 255 },
        dayOfBirth: { type: Date, default: new Date(1900, 0, 2) },
        avatar: { type: String, maxLength: 600 },
        gender: { type: String, maxLength: 8 },
        job: { type: String, maxLength: 255 },
        phone: { type: String, maxLength: 10 },
    },
    {
        timestamps: true,
    },
);

//App plugin
Person.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
Person.plugin(AutoIncrement, {inc_field: 'personId'});

module.exports = mongoose.model("persons", Person);
