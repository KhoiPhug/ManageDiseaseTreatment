const Person = require("../models/Person");
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require("../../utils/mongoose");

class PersonController {
    //[GET] /persons/api/create
    createPerson(req, res, next) {
        const person = new Person({
            id: 4,
            accountId: 4,
            name: "Nguyễn Thị Mai",
            address: "Thanh Ba district, Phú Thọ province",
            dayOfBirth: new Date(1980, 7, 25),
            avatar: "",
            gender: "Female",
            job: "Specialist doctor",
            phone: "0900111321",
        });
        person
            .save()
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(next);
    }

    //[GET] persons/getlisttoform
    getListToForm(req, res, next) {
        Person.find({ job: "General doctor" })
            .then((patient) => {
                let result = [];
                patient.forEach((item) => {
                    let { _id, personId, name } = item;
                    result.push({ _id, personId, name });
                });

                res.json(result);
            })
            .catch(next);
    }

    //[GET] persons/getlisttospecform
    getListToSpecForm(req, res, next) {
        Person.find({ job: "Specialist doctor" })
            .then((patient) => {
                let result = [];
                patient.forEach((item) => {
                    let { _id, personId, name } = item;
                    result.push({ _id, personId, name });
                });

                res.json(result);
            })
            .catch(next);
    }

    //[GET] persons/:phone
    show(req, res, next) {
        Person.findOne({ phone: req.params.phone })
            .then((person) => {
                res.render("persons/show", {
                    person: mongooseToObject(person),
                });
            })
            .catch(next);
    }

    //[GET] persons/api/:phone
    apiShow(req, res, next) {
        Person.findOne({ phone: req.params.phone })
            .then((person) => {
                res.json(person);
            })
            .catch(next);
    }

    //[GET] persons/create
    create(req, res, next) {
        res.render("persons/create");
    }

    //[POST] persons/store
    store(req, res, next) {
        const person = new Person(req.body);
        person
            .save()
            .then(() => res.redirect("/persons/stored/profile"))
            .catch((error) => {});
        // res.json(req.body);
    }

    //[GET] persons/stored/profile
    storedProfile(req, res, next) {
        let personQuery = Person.find({});

        if (req.query.hasOwnProperty("_sort")) {
            personQuery = personQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([personQuery, Person.countDocumentsDeleted()])
            .then(([persons, deletedCount]) =>
                res.render("persons/stored-profile", {
                    deletedCount,
                    persons: multipleMongooseToObject(persons),
                }),
            )
            .catch(next);
    }

    //[GET] persons/:id/edit
    edit(req, res, next) {
        Person.findById(req.params.id)
            .then((person) =>
                res.render("persons/edit", {
                    person: mongooseToObject(person),
                }),
            )
            .catch(next);
    }

    //[PUT] persons/:id
    update(req, res, next) {
        Person.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/persons/stored/profile"))
            .catch(next);
    }

    //[DELETE] persons/:id
    delete(req, res, next) {
        Person.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[DELETE] persons/:id/force
    forceDelete(req, res, next) {
        Person.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[GET] persons/trash/profile
    trashProfile(req, res, next) {
        Person.findDeleted({})
            .then((persons) =>
                res.render("persons/trash-profile", {
                    persons: multipleMongooseToObject(persons),
                }),
            )
            .catch(next);
    }

    //[PATCH] persons/:id/restore
    restore(req, res, next) {
        Person.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[POST] persons/handle-form-action
    handleFormAction(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Person.delete({ _id: { $in: req.body.personIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({ message: "Action is invalid" });
        }
    }

    //[GET] persons/getCurrentPerson/:accountId
    getCurrentPerson(req, res, next) {
        Person.findOne({ accountId: req.params.accountId })
            .then((person) => {
                res.json(person);
            })
            .catch(next);
    }

    //[PUT] persons/updatePerson/:id
    updatePerson(req, res, next) {
        const { name, address, gender, phone, dayOfBirth } = req.body;

        const person = {
            name,
            address,
            gender,
            phone,
            dayOfBirth: new Date(dayOfBirth),
        };

        Person.updateOne({ _id: req.params.id }, person)
            .then((person) => {
                res.json(person);
            })
            .catch(next);
    }
}

module.exports = new PersonController();
