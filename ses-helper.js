var aws = require("aws-sdk");
// locking the SES sdk version
aws.config.apiVersions = {
  ses: '2010-12-01',
};

// Credentials of user with access to SES
const ses = new aws.SES({
    "accessKeyId": "xxxxxx",
    "secretAccessKey": "xxxxxx",
    "region": "us-east-1"
});

var fnSendEmail = function(body, successCallback, errorCallback) {
    var source = null;
    var replyTo = null;
    var recipients = null;
    var subject = "No Subject";
    var message = null;
    //If the message cannot be delivered to the recipient, then an error message will be returned from the recipient's ISP; this message will then be forwarded to the email address
    var returnPath = "your default email address";

    if (body.recipient != null){
        if(Array.isArray(body.recipient) && body.recipient.length>0){
            recipients = body.recipient;
        }else{
            // convert recipient to array if there is only one recipient
            if(body.recipient.trim() != ''){
                recipients = [body.recipient];
            }
        }
    }
    
    // recipients required
    if (recipients == null) {
        errorCallback(new Error("Error!!! To email addresses are not provided"));
        return;
    }
    
    // source email-id will be displayed as "FROM"     
    if (body.sender != null) {
        source = body.sender;
    }
    
    if (body.replyTo != null) {
        replyTo = body.replyTo;
    }else{
        // sender will be used replyTo, if replyTo not provided
        if(body.sender){
            replyTo = body.sender;
        }
    }

    if (body.subject != null) {
        subject = body.subject;
    }
    if (body.message != null && body.message.trim() != '') {
        message = body.message;
    }
    if (message == null) {
        errorCallback(new Error("Error!!! Email message is empty"));
        return;
    }

    var eparam = {
        Destination: {
            ToAddresses: recipients
        },
        Message: {
            Body: {
                Html: {
                    Data: "<p>" + message + "</p>"
                },
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: source,
        ReplyToAddresses: [replyTo],
        ReturnPath: returnPath
    };

    try {
        ses.sendEmail(eparam, function(err, data) {
            if (err) {
                errorCallback(err);
            } else {
                var res = {
                    emailStatus: "sent",
                };
                successCallback(res);
            }
        });
        
    } catch (e) {
        console.error(e);
        errorCallback(e);
    }
};

var allFuns = {
    sendEmail: fnSendEmail
};

module.exports = allFuns;