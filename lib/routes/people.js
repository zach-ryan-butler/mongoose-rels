const { Router } = require('express');
const Person = require('../models/Person');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            name,
            email
        } = req.body;

        Person
            .create({ name, email })
            .then(person => res.send(person))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Person 
            .find()
            .then(people => res.send(people))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Person.findById(req.params.id),
            Dog.find({ owner: req.params.id })
        ])
            .then(([person, dogs]) => res.send({...person.toJSON(), dogs }))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const {
            name
        } = req.body;

        Person 
            .findByIdAndUpdate(req.params.id, { name }, { new: true})
            .then(person => res.send(person))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Person 
            .findByIdAndDelete(req.params.id)
            .then(person => res.send(person))
            .catch(next);
    });
