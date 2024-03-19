const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        username: { type: String, maxLength: 8 },
        password: { type: String, maxLength: 255 },
        fullname: { type: String, maxLength: 255 },
        job: { type: String, maxLength: 255 },
    },
    {
        timestamps: true,
    },
);

//App plugin
Account.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });
Account.plugin(AutoIncrement, {inc_field: 'ID'});

module.exports = mongoose.model("accounts", Account);
