const { Router } = require('express');
const Dog = require('../models/Dog');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            name,
            age,
            weight,
            owner
        } = req.body;

        Dog 
            .create({ name, age, weight, owner })
            .then(dog => res.send(dog))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Dog 
            .find()
            .then(dog => res.send(dog))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Dog
            .findById(req.params.id)
            .populate('owner')
            .then(dog => res.send(dog))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const {
            name,
            age,
            weight
        } = req.body;

        Dog
            .findByIdAndUpdate(req.params.id, { name, age, weight }, { new: true })
            .then(dog => res.send(dog))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Dog 
            .findByIdAndDelete(req.params.id)
            .then(dog => res.send(dog))
            .catch(next);
    });