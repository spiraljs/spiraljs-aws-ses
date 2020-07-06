const sesHelper = require('ses-helper');

exports.handler = (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

    // custom callback to use on successful execution
    const successCallback = (res) => callback(null, res);
    // custom callback to use on error
    const errorCallback = (err, code) => callback(JSON.stringify({
        errorCode: code ? code : 400,
        errorMessage: err ? err.message : err
    }));

    try {
        sesHelper.sendEmail(event.body, successCallback, errorCallback);
    } catch (e) {
        errorCallback(e);
    }
};