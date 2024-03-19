const Person = require('../models/Person');
const { multipleMongooseToObject } = require('../../utils/mongoose');

class SiteController {
    // [GET] /home
    index(req, res, next) {
        Person.find({})
            .then((persons) =>
                res.render('home', {
                    persons: multipleMongooseToObject(persons),
                }),
            )
            .catch(next);
    }
    // [GET] /api/home
    apiIndex(req, res, next) {
        Person.find({})
            .then((persons) => res.json(persons))
            .catch(next);
    }
    // [GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
