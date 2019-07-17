const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;