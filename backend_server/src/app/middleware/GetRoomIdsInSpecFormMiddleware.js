const SpecForm = require('../models/SpecForm')

module.exports = function GetRoomIdsInSpecFormMiddleware(req, res, next) {

    let {formId,existingRoomIds} = req.body;

    SpecForm.find({})
        .then((specForms) => {
            let notExistRoomIds = [];
            specForms.forEach((item) => {
                if(item.formId == formId && !existingRoomIds.includes(item.roomId)){
                    notExistRoomIds.push(item.roomId);
                }
            });

            if(notExistRoomIds.length > 0){
                req.body = {
                    ...req.body,
                    notExistRoomIds,
                };
                next();
            }else{
                req.body = {
                    ...req.body,
                    notExistRoomIds,
                };
                next();
            }
        })
        .catch(next);
};
