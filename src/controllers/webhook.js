import {
  Client
} from '@line/bot-sdk'
import Bot from '../bot'
import card from '../card'
import webhookMessageHandler from './webhookMessageHandler'
import async from 'async'

const {
  channelAccessToken,
  channelSecret
} = process.env

const client = new Client({
  channelAccessToken,
  channelSecret
});

const bot = new Bot()

const handleBeacon = (event, callback) => {
  const { replyToken } = event
  //push data to user
  console.log('recive beacon')
  replyTo(replyToken, {
    type: 'flex',
    altText: "This is a Flex Message",
    contents: card
  })
  callback()
}

const handleFollow = (event, callback) => {
  const { replyToken } = event
  //add user id to DB
  console.log('someone follow us')
  replyTo(replyToken, {
    type: 'text',
    text: 'ขิง ข่า ตะใคร้ ใบมะกรูด'
  })
  callback()
}

const handleUnfollow = (event, callback) => {
  //remove user id in DB
  console.log('someone unfollow us')
  callback()
}

const webhook = (req, res) => {
  checkEventType(req)
  res.status(200).end()
}

const handleMessage = (event, callback) => {
  const { replyToken, message } = event
  const userId = event.source.userId
  const messageType = message.type

  if (messageType === 'text') {
    bot.pushMessage(userId, message.text).then(queryResult => {
      const intentName = getIntent(queryResult)
      webhookMessageHandler(intentName, queryResult, replyToken, callback)
    });
  } else {
    console.error('MessageType Not implemented ' + messageType)
  }
}

const eventMapping = {
  message: handleMessage,
  beacon: handleBeacon,
  follow: handleFollow,
  unfollow: handleUnfollow
}

const checkEventType = (req) => {
  const events = req.body.events
  const funcs = events.map(event => {
    return (callback) => {
      const type = event.type
      if (eventMapping[type]) {
        eventMapping[type](event, callback)
      } else {
        console.error("EventType Not implemented " + type)
      }
    }
  })

  async.series(funcs, (err) => {
    if (err) {
      console.error(err)
    }
  })

}

export const replyTo = (replyToken, messageObj) => {
  return client.replyMessage(replyToken, messageObj)
}

export const sendTo = (userId, messageObj) => {
  return client.pushMessage(userId, messageObj)
}

const getIntent = (queryResult) => queryResult.intent.displayName

export default webhook