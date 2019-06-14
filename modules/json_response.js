module.exports = function (res, instance, statusCode) {
    statusCode = parseInt(statusCode, 10);
    var title = "";
    var detail = "";

    switch (statusCode) {
        case 200:
            title = "OK";
            break;
        case 201:
            detail = "Created";
            break;
        case 400:
            title = "Bad Request";
            detail = "Invalid request";
            break;
        case 404:
            title = "Not Found";
            detail = "The specified resource is not found";
            break;
        case 500:
            title = "Internal Server Error";
            detail = "Something went wrong";
            break;
        default:
            throw Error("Invalid status code");
    }

    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    //Support header x-access-token for the authentication token
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, Authorization');
    res.header('Content-Type', 'application/json');

    if (statusCode === 200 || statusCode === 201) {
        res.status(statusCode).json(instance);
    } else {
        res.status(statusCode).send({
            title: title,
            detail: detail,
            status: statusCode,
            instance: instance,
        });
    }
};