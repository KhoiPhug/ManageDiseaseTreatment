const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Counter = new Schema(
    {
        id: {type: String},
        seq: {type: Number}
    }
);

//App plugin

module.exports = mongoose.model("counters", Counter);
