import { Client } from '@line/bot-sdk'
import Bot from '../bot'
import card from '../card'

const { channelAccessToken, channelSecret } = process.env

const client = new Client({ channelAccessToken, channelSecret });
const bot = new Bot()

const webhook = (req, res) => {
  console.log(req.body.events[0])
  checkMessageType(req)
  res.status(200).end()
}

export const replyTo = (replyToken, messageObj) => {
  client.replyMessage(replyToken, messageObj)
}

export const sendTo = (userId, messageObj) => {
  client.pushMessage(userId, messageObj)
}

const checkMessageType = (req) => {
  const type = req.body.events[0].type
  const replyToken = req.body.events[0].replyToken
  //handle message 
  if (type === 'message') {
    const userId = req.body.events[0].source.userId
    const message = req.body.events[0].message
    const messageType = message.type
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
  else if (type === 'beacon') {
    //push data to user
    console.log('recive beacon')
    replyTo(replyToken, {
      type: 'flex',
      altText: "This is a Flex Message",
      contents: card
    })
  }
  else if (type === 'follow') {
    //add user id to DB
    console.log('someone follow us')
    replyTo(replyToken, {
      type: 'text',
      text: 'ขิง ข่า ตะใคร้ ใบมะกรูด'
    })
  }
  else if (type === 'unfollow') {
    //remove user id in DB
    console.log('someone unfollow us')
  }
}


const checkIntent = (queryResult, line) => {
  console.log(queryResult)
  console.log(line)

  var intentName = queryResult.intent.displayName
  var replyToken = line.replyToken

  if (intentName === 'ask info - custom') {
    var sensor = queryResult.parameters.fields.sensor.stringValue
    //request data from DB

    //reply
    replyTo(replyToken, {
      type: 'text',
      text: '' + sensor + ' : ' + 12345678
    })
  }
  // handle normal intent
  else {
    console.log('reply : ', queryResult.fulfillmentText)
    replyTo(replyToken, {
      type: 'text',
      text: queryResult.fulfillmentText
    })
  }
}

export default webhook