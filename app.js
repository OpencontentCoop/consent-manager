const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");

const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// DB CONNECTION
const url = process.env.DB_URL;
const connect = mongoose.connect(url, {useNewUrlParser: true});

connect.then(function () {
    console.log('Connected correctly to database');
}, function (err) {
    /* istanbul ignore next */
    console.log(err);
});

// Rate limit
// https://www.npmjs.com/package/express-rate-limit
const limit_per_second = rateLimit({
    windowMs: 1000, // 1 second
    max: 5, // limit each IP to 5 requests per windowMs
});

const limit_per_hour = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10800, // limit each IP to 10800 requests per windowMs
});

/* istanbul ignore next */
if (!process.env.TEST) {
    app.use('/consents/', limit_per_second);
    app.use('/consents/', limit_per_hour);
}

// APIs
var consents = require('./routes/consents');
app.use('/consents', consents);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app; // for testing
