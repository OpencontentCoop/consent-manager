const express = require('express');
const bodyParser = require('body-parser');

const models = require('../models/consents');
var response = require('../modules/json_response');


const router = express.Router();


router.use(bodyParser.json());

//TODO: fix responses

router.route('/')
// listConsents: list consents registered
    .get(function (req, res) {
        models.Consents
            .find({})
            .then(function (consents) {
                response(res, consents, 200);
            })
            .catch(function (err) {
                response(res, err, 500);
            })
    })
    // createConsent: create a consent
    .post(function (req, res) {
        // Retrieve ip from request object
        var ip = ((req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress);

        // Check if consent already exists
        models.Consents
            .findOne({
                ip: ip,
                subject: req.body.subject,
                source_url: req.body.source_url
            })
            .then(function (consent) {
                if (consent === null) {
                    // Consent does not exists, create a new one
                    var new_consent = new models.Consents({
                        ip: ip,
                        subject: req.body.subject,
                        source_url: req.body.source_url
                    });
                    // Create subdocuments
                    req.body.legal_docs.forEach(function (legal_doc) {
                        var version = legal_doc.version;
                        // Delete version to be sure to extract the right object
                        delete legal_doc.version;
                        var short_name = Object.keys(legal_doc).pop();

                        var document = new models.Documents({
                            version: version,
                            short_name: short_name,
                            content: legal_doc[short_name]
                        });
                        new_consent.legal_docs.push(document);
                    });
                    new_consent
                        .save()
                        .then(function (consent) {
                            response(res, consent, 201);
                        })
                        .catch(function (err) {
                            response(res, err.message, 500);
                        })

                } else {
                    // Consent already exists, update or add new docs
                    req.body.legal_docs.forEach(function (legal_doc) {
                        var found = false;
                        var version = legal_doc.version;
                        delete legal_doc.version;
                        var short_name = Object.keys(legal_doc).pop();

                        consent.legal_docs.forEach(function (old_legal_doc) {
                            if ((old_legal_doc.short_name === short_name) && (old_legal_doc.content !== legal_doc[short_name])) {
                                // Update doc
                                found = true;
                                old_legal_doc.set({
                                    version: (version == null) ? old_legal_doc.version + 1 : version,
                                    short_name: short_name,
                                    content: legal_doc[short_name]
                                });

                            } else if (old_legal_doc.short_name === short_name) {
                                // Nothing to do
                                found = true;
                            }
                        });
                        if (!found) {
                            // Add new documents
                            var document = new models.Documents({
                                version: version,
                                short_name: short_name,
                                content: legal_doc[short_name]
                            });
                            consent.legal_docs.push(document);
                        }
                    });
                    // Update consent
                    consent
                        .save()
                        .then(function (consent) {
                            response(res, consent, 201);
                        })
                        .catch(function (err) {
                            response(res, err, 500);
                        });
                }
            })
    });

router.route('/:id')
// getConsent: retrieve a consent
    .get(function (req, res) {
        models.Consents.findById(req.params.id)
            .then(function (consent) {
                if (consent) {
                    response(res, consent, 200);
                } else {
                    response(res, req.originalUrl, 404);
                }
            })
            .catch(function (err) {
                response(res, err, 500);
            })
    });

module.exports = router;

