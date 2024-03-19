const Person = require("../models/Person");

module.exports = function DeletePersonMiddleware(req, res, next) {
    Person.delete({ accountId: req.params.id })
        .then(() => {
            next();
        })
        .catch(next);
};
