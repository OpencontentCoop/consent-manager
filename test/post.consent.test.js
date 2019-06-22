const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();


chai.use(chaiHttp);

// test POST /consents route
describe('/POST CONSENT', function () {
    // Success consent creation with client ip
    it('Should create a new consent', function (done) {

        chai.request(app)
            .post('/consents')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('ip');
                res.body.should.have.property('created_at');
                res.body.should.have.property('subject');
                res.body.should.have.property('source_url');
                res.body.should.have.property('legal_docs');
                res.body.subject.should.deep.equal(["email", "given_name", "tax_code"]);
                res.body.source_url.should.equal("http://mywebsite.com/privacy");
                res.body.legal_docs.should.deep.equal([
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]);
                done();
            });
    });
    // Create a new consent with X-Forwarded-For ip
    it('Should create a new consent with X-Forwarded-For ip', function (done) {
        chai.request(app)
            .post('/consents')
            .set('x-forwarded-for', '1.1.1.1')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('ip');
                res.body.should.have.property('created_at');
                res.body.should.have.property('subject');
                res.body.should.have.property('source_url');
                res.body.should.have.property('legal_docs');
                res.body.ip.should.equal('1.1.1.1');
                res.body.subject.should.deep.equal(["email", "given_name", "tax_code"]);
                res.body.source_url.should.equal("http://mywebsite.com/privacy");
                res.body.legal_docs.should.deep.equal([
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]);
                done();
            });
    });
    // Invalid doc of existing Consent
    it('Should be a bar request for invalid document of existing Consent', function (done) {
        chai.request(app)
            .post('/consents')
            .set('x-forwarded-for', '1.1.1.1')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    },
                    {
                        "version": 7
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Bad Request');
                res.body.detail.should.equal('Consent validation failed: ' +
                    'legal_docs.2.short_name: Short name is a mandatory field, ' +
                    'legal_docs.2.content: Document content is a mandatory field');
                res.body.status.should.equal(400);
                res.body.instance.should.equal('/consents');
                done();
            });
    });

    // Invalid doc of new Consent
    it('Should be a bar request for invalid document of new Consent', function (done) {
        chai.request(app)
            .post('/consents')
            .set('x-forwarded-for', '1.1.1.2')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "version": 1
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Bad Request');
                res.body.detail.should.equal('Consent validation failed: ' +
                    'legal_docs.0.short_name: Short name is a mandatory field, ' +
                    'legal_docs.0.content: Document content is a mandatory field');
                res.body.status.should.equal(400);
                res.body.instance.should.equal('/consents');
                done();
            });
    });
    // Ip validation error
    it('Should be an ip validation error', function (done) {
        chai.request(app)
            .post('/consents')
            .set('x-forwarded-for', '1.1.1.999')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Bad Request');
                res.body.detail.should.equal('Consent validation failed: ip: 1.1.1.999 is not a valid ip');
                res.body.status.should.equal(400);
                res.body.instance.should.equal('/consents');
                done();
            });
    });
    // Consent already exists
    it('Should not create a new consent', function (done) {
        chai.request(app)
            .post('/consents')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('ip');
                res.body.should.have.property('created_at');
                res.body.should.have.property('subject');
                res.body.should.have.property('source_url');
                res.body.should.have.property('legal_docs');
                res.body.subject.should.deep.equal(["email", "given_name", "tax_code"]);
                res.body.source_url.should.equal("http://mywebsite.com/privacy");
                res.body.legal_docs.should.deep.equal([
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    }
                ]);
                done();
            });
    });
    // Add new document to existing consent with autoversioning
    it('Should add a new document with autoversioning', function (done) {
        chai.request(app)
            .post('/consents')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    },
                    {
                        "test": "Test contents 1....",
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('ip');
                res.body.should.have.property('created_at');
                res.body.should.have.property('subject');
                res.body.should.have.property('source_url');
                res.body.should.have.property('legal_docs');
                res.body.subject.should.deep.equal(["email", "given_name", "tax_code"]);
                res.body.source_url.should.equal("http://mywebsite.com/privacy");
                res.body.legal_docs.should.deep.equal([
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service....",
                        "version": 3
                    },
                    {
                        "test": "Test contents 1....",
                        "version": 1
                    }
                ]);
                done();
            });
    });
    // Update document with autoversioning
    it('Should update a document with autoversioning', function (done) {
        chai.request(app)
            .post('/consents')
            .send({
                "subject": ["email", "given_name", "tax_code"],
                "source_url": "http://mywebsite.com/privacy",
                "legal_docs": [
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service2....",
                        "version": 4
                    },
                    {
                        "test": "Test contents 2....",
                    }
                ]
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('ip');
                res.body.should.have.property('created_at');
                res.body.should.have.property('subject');
                res.body.should.have.property('source_url');
                res.body.should.have.property('legal_docs');
                res.body.subject.should.deep.equal(["email", "given_name", "tax_code"]);
                res.body.source_url.should.equal("http://mywebsite.com/privacy");
                res.body.legal_docs.should.deep.equal([
                    {
                        "privacy_policy": "Privacy policy contents...",
                        "version": 1
                    },
                    {
                        "terms": "Terms of service2....",
                        "version": 4
                    },
                    {
                        "test": "Test contents 2....",
                        "version": 2
                    }
                ]);
                done();
            });
    });
    // Invalid data
    it('Should be a bad request (invalid data)', function (done) {
        chai.request(app)
            .post('/consents')
            .send({
                "subject": ["email", "given_name", "tax_code"]
            })
            .end(function (err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Bad Request');
                res.body.detail.should.equal('The body of the request is invalid');
                res.body.status.should.equal(400);
                res.body.instance.should.equal('/consents');
                done();
            });
    });
});
