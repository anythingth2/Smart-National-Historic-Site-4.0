const Client = require('@line/bot-sdk').Client;
const Bot = require('./bot');
const config = require('./line_config').config

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


            // client.pushMessage(userId,{
            //     type: 'text',
            //     text: 'You user id is : '+userId,
            // })
            bot.pushMessage(message.text).then(resMessage => {
                client.replyMessage(replyToken, {
                    type: 'text',
                    text: resMessage,
                })
            });
        }
    } else {
        res.json()
    }
}

module.exports = webhook