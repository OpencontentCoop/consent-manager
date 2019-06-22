const express = require('express');
const bodyParser = require('body-parser');

var response = require('../modules/json_response');
var isValid = require('../modules/is_valid');

const models = require('../models/consents');

const router = express.Router();

router.use(bodyParser.json());

router.route('/')
// listConsents: list consents registered
    .get(function (req, res) {
        // https://www.npmjs.com/package/mongo-cursor-pagination
        models.Consents.paginate({
            limit: Number(req.query.limit),
            next: req.query.next,
            previous: req.query.previous
        }).then(function (results) {
            var new_results = [];
            results.results.forEach(function (consent) {
                new_results.push(models.Consents(consent));
            });
            results.results = new_results;
            response(res, 'OK', results, 200);
        }).catch(function (err) {
            // Invalid parameter
            response(res, err.message, req.originalUrl, 400);
        })
    })
    // createConsent: create a consent
    .post(isValid, function (req, res) {
        // Retrieve ip from request object
        var ip = ((req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);

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
                            response(res, 'Created', consent, 201);
                        })
                        .catch(function (err) {
                            response(res, err.message, req.originalUrl, 400);
                        })
                } else {
                    // Consent already exists, update or add new docs
                    req.body.legal_docs.forEach(function (legal_doc) {
                        var found = false;
                        var version = legal_doc.version;
                        // Delete version to be sure to extract the right object
                        delete legal_doc.version;
                        var short_name = Object.keys(legal_doc).pop();

                        consent.legal_docs.forEach(function (old_legal_doc) {
                            // Same short_name, but different content
                            if ((old_legal_doc.short_name === short_name) && (old_legal_doc.content !== legal_doc[short_name])) {
                                // Update document
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
                            response(res, 'OK', consent, 200);
                        })
                        .catch(function (err) {
                            response(res, err.message, req.originalUrl, 400);
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
                    response(res, 'OK', consent, 200);
                } else {
                    response(res, 'The specified resource is not found', req.originalUrl, 404);
                }
            })
            .catch(function (err) {
                // skip line for test coveragen (Query failed - Server Error)
                /* istanbul ignore next */
                response(res, err.message, req.originalUrl, 500);
            })
    });

module.exports = router;
