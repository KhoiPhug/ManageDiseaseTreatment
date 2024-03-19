const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Room = new Schema(
    {
        name: { type: String, maxLength: 255 },
        type: { type: String, maxLength: 255 },
    },
    {
        timestamps: true,
    },
);

//App plugin
Room.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
Room.plugin(AutoIncrement, {inc_field: 'roomId'});

module.exports = mongoose.model("rooms", Room);
