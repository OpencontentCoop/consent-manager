const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

describe('/GET CONSENTS', function () {
    // Create new consent for testing and request by id
    it('Should retrieve consents', function (done) {
        chai.request(app)
            .get('/consents')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.results.should.be.an('array');
                res.body.should.have.property('results');
                res.body.should.have.property('hasPrevious');
                res.body.should.have.property('hasNext');
                done();
            });
    });
    // Limit testing
    it('Should retrieve two consents', function (done) {
        chai.request(app)
            .get('/consents?limit=2')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.results.should.be.an('array');
                res.body.should.have.property('results');
                res.body.should.have.property('hasPrevious');
                res.body.should.have.property('hasNext');
                res.body.results.length.should.equal(2);
                done();
            })
    });
    // invalid parameter
    it('Should be a bad request (Invalid parameters)', function (done) {
        chai.request(app)
            .get('/consents?next=1')
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Bad Request');
                res.body.detail.should.equal('Invalid request');
                res.body.status.should.equal(400);
                res.body.instance.should.equal('/consents?next=1');
                done();
            });
    });
});
