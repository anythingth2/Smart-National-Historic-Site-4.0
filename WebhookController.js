const Client = require('@line/bot-sdk').Client;
const config = require('./line_config').config

const client = new Client(config);

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
            client.replyMessage(replyToken, {
                type: 'text',
                text: 'this is reply from webhook naja',
            })
            // client.pushMessage(userId,{
            //     type: 'text',
            //     text: 'You user id is : '+userId,
            // })
        }
    }else{
        res.json()
    }
}

module.exports = webhook