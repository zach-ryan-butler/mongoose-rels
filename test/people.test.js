require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Person = require('../lib/models/Person');
const Dog = require('../lib/models/Dog');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a person', () => {
    return request(app)
      .post('/api/v1/people')
      .send({ name: 'zach', email: 'zach@zach.com' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'zach',
          email: 'zach@zach.com',
          __v: 0
        });
      });
  });

  it('can get people', async() => {
    const people = await Person.create([
      { name: 'zach', email: 'zach@zach.com' },
      { name: 'zach1', email: 'zach1@zach1.com' },
      { name: 'zach2', email: 'zach2@zach2.com' }
    ]);

    return request(app)
      .get('/api/v1/people')
      .then(res => {
        const peopleJSON = JSON.parse(JSON.stringify(people));
        peopleJSON.forEach(person => {
          expect(res.body).toContainEqual(person);
        });
      });
  });

  it('can get a person by id', async() => {
    const person = await Person.create({ name: 'zach', email: 'zach@zach.com'});
    const dogs = await Dog.create([
      { name: 'spot', age: 5, weight: '20lbs', owner: person._id },
      { name: 'rover', age: 10, weight: '30lbs', owner: person._id },
      { name: 'george', age: 55, weight: '40lbs', owner: person._id }
    ]);

    return request(app)
      .get(`/api/v1/people/${person._id}`)
      .then(res => {
        const dogsJSON = JSON.parse(JSON.stringify(dogs));
        expect(res.body.name).toEqual('zach');
        dogsJSON.forEach(dog => {
          expect(res.body.dogs).toContainEqual(dog);
        });
      });
  });

  it('can update a person by id', async() => {
    const person = await Person.create({ name: 'zach', email: 'zach@zach.com' });

    return request(app)
      .put(`/api/v1/people/${person._id}`)
      .send({ name: 'zach3' })
      .then(res => {
        const personJSON = JSON.parse(JSON.stringify(person));
        expect(res.body).toEqual({
          ...personJSON,
          name: 'zach3'
        });
      });
  });

  it('can delete a person by id', async() => {
    const person = await Person.create({ name: 'zach', email: 'zach@zach.com' });

    return request(app)
      .delete(`/api/v1/people/${person._id}`)
      .then(res => {
        const personJSON = JSON.parse(JSON.stringify(person));
        expect(res.body).toEqual(personJSON);
      });
  });
});
