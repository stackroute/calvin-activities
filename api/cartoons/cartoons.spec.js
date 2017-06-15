/* eslint-env mocha */
const chai = require('chai');
const app = require('../../app');
const request = require('supertest');

chai.should();

describe('/cartoons api', () => {
  const cartoonToCreate = {
    name: 'Mickey Mouse',
    author: 'Walt Disney',
  };

  it('it should create a new cartoon', (done) => {
    request(app)
      .post('/cartoons')
      .send(cartoonToCreate)
      .expect(201)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.name.should.be.equal(cartoonToCreate.name);
        res.body.author.should.be.equal(cartoonToCreate.author);
        res.body.id.should.be.equal(0);
        done();
      });
  });

  it('it should create a new cartoon', (done) => {
    request(app)
      .post('/cartoons')
      .send(cartoonToCreate)
      .expect(201)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.name.should.be.equal(cartoonToCreate.name);
        res.body.author.should.be.equal(cartoonToCreate.author);
        res.body.id.should.be.equal(1);
        done();
      });
  });

  it('it should retrieve list of cartoons', (done) => {
    request(app)
      .get('/cartoons')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.lengthOf(2);
        done();
      });
  });

  it('it should retrieve cartoon by id', (done) => {
    request(app)
      .get('/cartoons/0')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.name.should.be.equal(cartoonToCreate.name);
        res.body.author.should.be.equal(cartoonToCreate.author);
        done();
      });
  });
});
