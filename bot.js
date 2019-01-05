const dialogflow = require('dialogflow');
const config = require('./config');
class Bot {
    constructor() {

    }
    pushMessage(msg) {
        var sessionClient = new dialogflow.SessionsClient();
        var sessionPath = sessionClient.sessionPath(config.projectId, 'test');
        return new Promise((resolve, reject) => {
            sessionClient.detectIntent({
                session: sessionPath,
                queryInput: {
                    text: {
                        text: msg,
                        languageCode: 'th-TH'
                    },
                }
            }).then(responses => {
                
                console.log('detect intent');
                const result = responses[0].queryResult;
                console.log(`Query: ${result.queryText}`);
                console.log(`Response: ${result.fulfillmentText}`);
                if (result.intent) {
                    console.log(`Intent: ${result.intent.displayName}`);
                } else {
                    console.log(` No intent matched`);
                }
                console.log();
                resolve();
            }).catch(err => {
                console.error('Error: ', err);
                reject();
            });
        });
    }
}

module.exports = Bot;