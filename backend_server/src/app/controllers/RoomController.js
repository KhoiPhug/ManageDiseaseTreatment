const Room = require('../models/Room');
const { multipleMongooseToObject } = require('../../utils/mongoose');

class RoomController {

    //[GET] /room/create
    createRoom(req,res,next){

        const room = new Room({
            name: "Specialist Clinic 2",
            type: "specialist_clinic"
        });
        room
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(next);
    }

    //[GET] /room/getlist
    getList(req,res,next){
        Room.find({})
            .then((room) => {
                let result = [];
                room.forEach((item) => {
                    let {_id,roomId,name} = item;
                    result.push({_id,roomId,name})
                })
                
                res.json(result)
            })
            .catch(next);
    }

    // // [GET] /home
    // index(req, res, next) {
    //     Person.find({})
    //         .then((persons) =>
    //             res.render('home', {
    //                 persons: multipleMongooseToObject(persons),
    //             }),
    //         )
    //         .catch(next);
    // }
    // // [GET] /api/home
    // apiIndex(req, res, next) {
    //     Person.find({})
    //         .then((persons) => res.json(persons))
    //         .catch(next);
    // }
    // // [GET] /search
    // search(req, res) {
    //     res.render('search');
    // }
}

module.exports = new RoomController();
