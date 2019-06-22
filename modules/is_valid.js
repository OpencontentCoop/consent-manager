const response = require('../modules/json_response');

module.exports = function (req, res, next) {
    if (req.body.subject && req.body.source_url && req.body.legal_docs) {
        next();
    } else {
        response(res, 'The body of the request is invalid', req.originalUrl, 400);
    }
};
