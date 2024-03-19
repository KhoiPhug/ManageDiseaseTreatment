const Person = require("../models/Person");

module.exports = function DeletePersonsMiddleware(req, res, next) {
    Person.delete({ accountId: { $in: req.body } })
        .then(() => {
            next();
        })
        .catch(next);
};
