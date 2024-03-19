const SpecForm = require('../models/SpecForm')

module.exports = function DeleteSpecFormMiddleware(req, res, next) {
    let {formId, notExistRoomIds} = req.body;

    SpecForm.deleteMany({ formId: formId ,roomId: { $in: notExistRoomIds}})
        .then(() => {
            next();
        })
        .catch(next);
};
