class ErrorApi extends Error {
    constructor(message,statusCode) {
        super(message);
        this.status = statusCode;
        this.name = "errorApi";
    }
}
function errorApi(message,statusCode){
    throw new ErrorApi(message,statusCode)
}

module.exports = errorApi