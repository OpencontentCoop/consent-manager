const models = require('../models/consents');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('/GET CONSENT BY ID', function () {
    // Create new consent for testing and request by id
    it('Should retrieve one consent', function (done) {
        var new_consent = models.Consents({
            "ip": "1.2.3.4",
            "subject": ["email", "given_name", "tax_code"],
            "source_url": "http://mywebsite.com/privacy",
            "legal_docs": [
                {
                    "short_name": "privacy_policy",
                    "content": "Privacy policy contents...",
                    "version": 1
                },
                {
                    "short_name": "terms",
                    "content": "Terms of service....",
                    "version": 3
                }
            ]
        });
        // todo: fix warning
        new_consent
            .save()
            .then(function (consent) {
                chai.request(app)
                    .get('/consents/' + consent._id)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('id');
                        res.body.should.have.property('ip');
                        res.body.should.have.property('created_at');
                        res.body.should.have.property('subject');
                        res.body.should.have.property('source_url');
                        res.body.should.have.property('legal_docs');
                        res.body.id.should.equal(consent._id);
                        res.body.ip.should.equal("1.2.3.4");
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
                    }).catch(function (err) {
                    done();
                })
            });
    });
    // Consent not found
    it('Should be a not found error', function (done) {
        chai.request(app)
            .get('/consents/123')
            .end(function (err, res) {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('detail');
                res.body.should.have.property('status');
                res.body.should.have.property('instance');
                res.body.title.should.equal('Not Found');
                res.body.detail.should.equal('The specified resource is not found');
                res.body.status.should.equal(404);
                res.body.instance.should.equal('/consents/123');
                done();
            });
    });
});
