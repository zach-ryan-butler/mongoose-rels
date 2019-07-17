require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Dog = require('../lib/models/Dog');
const Person = require('../lib/models/Person');

describe('dogs routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let owner = null;
    beforeEach(async() => {
        const person = await Person.create({ name: 'zach' })

        owner = JSON.parse(JSON.stringify(person));
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('can create a dog', () => {
        return request(app)
            .post('/api/v1/dogs')
            .send({ name: 'spot', age: 5, weight: '15lbs', owner: owner._id})
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'spot',
                    age: 5,
                    weight: '15lbs',
                    owner: expect.any(String),
                    __v: 0
                });
            });
    });

    it('can get dogs', async() => {
        const dogs = await Dog.create([
            { name: 'spot', age: 5, weight: '20lbs', owner: owner._id},
            { name: 'rover', age: 10, weight: '40lbs', owner: owner._id},
            { name: 'bingo', age: 15, weight: '50lbs', owner: owner._id}
        ]);

        return request(app)
            .get('/api/v1/dogs')
            .then(res => {
                const dogsJSON = JSON.parse(JSON.stringify(dogs));
                dogsJSON.forEach(dog => {
                    expect(res.body).toContainEqual(dog);
                });
            });
    });

    it('can get a dog by id', async() => {
        const dog = await Dog.create({
            name: 'spot',
            age: 5,
            weight: '15lbs',
            owner: owner._id
        });

        return request(app)
            .get(`/api/v1/dogs/${dog._id}`)
            .then(res => {
                const dogJSON = JSON.parse(JSON.stringify(dog));
                expect(res.body).toEqual({
                    ...dogJSON,
                    owner
                });
            });
    });

    it('can update a dog by id', async() => {
        const dog = await Dog.create({
            name: 'spot',
            age: 5,
            weight: '20lbs',
            owner: owner._id
        });

        return request(app)
            .put(`/api/v1/dogs/${dog._id}`)
            .send({
                name: 'rover',
                age: 15,
                weight: '15lbs'
            })
            .then(res => {
                const dogJSON = JSON.parse(JSON.stringify(dog));
                expect(res.body).toEqual({
                    ...dogJSON,
                    name: 'rover',
                    age: 15,
                    weight: '15lbs',
                    owner: expect.any(String)
                });
            });
    });

    it('can delete a dog by id', async() => {
        const dog = await Dog.create({
            name: 'rover',
            age: 15,
            weight: '10lbs',
            owner: owner._id
        });

        return request(app)
            .delete(`/api/v1/dogs/${dog._id}`)
            .then(res => {
                const dogJSON = JSON.parse(JSON.stringify(dog));
                expect(res.body).toEqual(dogJSON);
            });
    }); 
});