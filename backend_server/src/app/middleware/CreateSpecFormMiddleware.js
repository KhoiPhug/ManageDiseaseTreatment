const SpecForm = require('../models/SpecForm')

module.exports = function CreateSpecFormMiddleware(req, res, next) {
    const {formId, roomIds} = req.body;
    let existedRoomIds = [];
    let existingRoomIds = [...roomIds];
    SpecForm.find({})
        .then((specForm) => {
            specForm.forEach((item) => {
                if(item.formId == formId && roomIds.includes(item.roomId)){
                    existedRoomIds.push(item.roomId);
                }
            })

            if(existedRoomIds.length > 0){
                let newRoomIds = roomIds.filter((item) => !existedRoomIds.includes(item))
                req.body = {
                    ...req.body,
                    roomIds: newRoomIds,
                    existingRoomIds,
                }
                next();
            }else{
                req.body = {
                    ...req.body,
                    existingRoomIds,
                }
                next();
            }
        })
        .catch(next);

    
};
