const mongoose = require('mongoose');

const url = process.env.DB_URL;
mongoose.connect(url, {useNewUrlParser: true})
    .then(function () {
        // clear test db
        mongoose.connection.collections.consents.drop();
    }, function (err) {
        console.log(err);
    });