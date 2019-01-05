const Client = require('@line/bot-sdk').Client;
const Bot = require('./bot');
//const checkIntent = require('./BusinessLogic')
const config = require('./line_config')

const client = new Client(config);
var bot = new Bot();

function webhook(req, res) {
    console.log(req.body.events[0])
    checkMessageType(req)
    res.json({})
}

function replyTo(replyToken, messageObj) {
    client.replyMessage(replyToken, messageObj)
}

function sendTo(userId, messageObj) {
    client.pushMessage(userId, messageObj)
}

// =====================================================

function checkMessageType(req){
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
    else if(type === 'beacon'){
        //push data to user
        console.log('recive beacon')
        replyTo(replyToken,{
            type:'flex',
            altText: "This is a Flex Message",
            contents: card
        })
    }
    else if(type === 'follow'){
        //add user id to DB
        console.log('someone follow us')
        replyTo(replyToken,{
            type:'text',
            text:'ขิง ข่า ตะใคร้ ใบมะกรูด'
        })
    }
    else if(type === 'unfollow'){
        //remove user id in DB
        console.log('someone unfollow us')
        
    }
}


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





const card = {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://sites.google.com/site/5751410084jirawadeepetchkorn/_/rsrc/1417593780473/sthan-thi-thxng-theiyw/2-phrarachwang-snam-canthr/E76_1989.jpg",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "uri": "https://th.wikipedia.org/wiki/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C"
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "พระราชวังสนามจันทร์",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ประเภท",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 2
                },
                {
                  "type": "text",
                  "text": "พระราชวัง",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 4
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ปีก่อสร้าง",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 2
                },
                {
                  "type": "text",
                  "text": "พ.ศ. 2450",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 4
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ผู้สร้าง",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 2
                },
                {
                  "type": "text",
                  "text": "\tพระบาทสมเด็จพระมงกุฎเกล้าเจ้าอยู่หัว",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 4
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "WEBSITE",
            "uri": "https://th.wikipedia.org/wiki/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C"
          }
        },
        {
          "type": "spacer",
          "size": "sm"
        }
      ],
      "flex": 0
    }
  }