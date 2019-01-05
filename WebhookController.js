const Client = require('@line/bot-sdk').Client;
const Bot = require('./bot');
//const checkIntent = require('./BusinessLogic')
const config = require('./line_config')

const client = new Client(config);
var bot = new Bot();

function webhook(req, res) {
    console.log(req.body.events[0])
    console.log('\n ================ \n')
    var type = req.body.events[0].type
    var replyToken = req.body.events[0].replyToken

    //handle message 
    if (type === 'message') {
        var userId = req.body.events[0].source.userId
        var message = req.body.events[0].message
        var messageType = message.type
        //handle text
        if (messageType === 'text') {
            bot.pushMessage(userId, message.text).then(queryResult => {
                checkIntent(queryResult, req.body.events[0])
                // replyTo(replyToken,{
                //     type:'text',
                //     text:queryResult.fulfillmentText
                // })
                // client.replyMessage(replyToken, {
                //     type: 'text',
                //     text: queryResult.fulfillmentText
                // })
            });
        }
    }
    res.json({})
}

function replyTo(replyToken, messageObj) {
    client.replyMessage(replyToken, messageObj)
}

function sendTo(userId, messageObj) {
    client.pushMessage(userId, messageObj)
}

// =====================================================

function checkIntent(queryResult,line){
    console.log(queryResult)
    console.log(line)

    var intentName = queryResult.intent.displayName
    var replyToken = line.replyToken

    if(intentName === 'ask info - custom'){
        var sensor = queryResult.parameters.fields.sensor.stringValue
        //request data from DB

        //reply
        replyTo(replyToken,{
            type:'text',
            text:''+sensor+' : '+ 12345678
        })
    }
    // handle normal intent
    else{
        console.log('reply : ',queryResult.fulfillmentText)
        replyTo(replyToken,{
            type:'text',
            text:queryResult.fulfillmentText
        })
    }
}

module.exports = {
    replyTo: replyTo,
    sendTo: sendTo,
    webhook: webhook,
    client: client
}


// client.replyMessage(replyToken, {
//     type: 'text',
//     text: resObj,
// })