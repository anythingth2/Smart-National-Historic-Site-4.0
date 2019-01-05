import dialogflow from 'dialogflow'

class Bot {
  pushMessage(lineId, msg) {
    var sessionClient = new dialogflow.SessionsClient();
    var sessionPath = sessionClient.sessionPath(process.env.projectId, lineId);
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
        console.log(`FulFillment_Messages: ${JSON.stringify(result.fulfillmentMessages)}`);
        if (result.intent) {
          console.log(`Intent: ${result.intent.displayName}`);
        } else {
          console.log(` No intent matched`);
        }
        console.log();
        resolve(result);
      }).catch(err => {
        console.error('Error: ', err);
        reject();
      });
    });
  }
}

export default Bot