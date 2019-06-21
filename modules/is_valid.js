const response = require('../modules/json_response');
module.exports = function (req, res, next) {
    try {
        req.body.should.have.keys('subject', 'source_url', 'legal_docs');
        next();
    } catch (ex) {
        response(res, req.body, 400);
    }
};
