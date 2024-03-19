const Person = require("../models/Person");

module.exports = function CreatePersonMiddleware(req, res, next) {
    const { fullname, job, accountId } = req.body;

    const person = new Person({
        id: -1,
        accountId: parseInt(accountId),
        name: fullname,
        address: "",
        avatar: "",
        gender: "",
        job: job,
        phone: "",
    });

    person
        .save()
        .then(() => {
            next();
        })
        .catch(next);
};
