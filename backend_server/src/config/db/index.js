const mongoose = require("mongoose");

async function connect() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            "mongodb+srv://ooad:ooad@ooad.skwyliy.mongodb.net/Clinic?retryWrites=true&w=majority",
        );
        console.log("success");
    } catch (error) {
        console.log("fail");
    }
}

module.exports = { connect };
