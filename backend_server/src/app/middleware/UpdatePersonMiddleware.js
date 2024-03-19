const Person = require("../models/Person");

module.exports = function UpdatePersonMiddleware(req, res, next) {
    const { fullname, job, ID } = req.body;

    const person = {
        name: fullname,
        job: job,
    };

    Person.updateOne({ accountId: ID }, person)
        .then(() => {
            next();
        })
        .catch(next);
};
