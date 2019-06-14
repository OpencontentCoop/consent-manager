const express = require('express');
const bodyParser = require('body-parser');

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
    console.log(err);
});


// APIs
var consents = require('./routes/consents');
app.use('/consents', consents);


app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});