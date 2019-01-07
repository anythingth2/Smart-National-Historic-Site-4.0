import {
  Client
} from '@line/bot-sdk'
import Bot from '../bot'
import card from '../card'
import Sensor from './sensor'
import webhookMessageHandler from './webhookMessageHandler'

const {
  channelAccessToken,
  channelSecret
} = process.env

const client = new Client({
  channelAccessToken,
  channelSecret
});
const bot = new Bot()

const handleBeacon = (req) => {
  const event = req.body.events[0]
  const { replyToken } = event
  //push data to user
  console.log('recive beacon')
  replyTo(replyToken, {
    type: 'flex',
    altText: "This is a Flex Message",
    contents: card
  })
}

const handleFollow = (req) => {
  const event = req.body.events[0]
  const { replyToken } = event
  //add user id to DB
  console.log('someone follow us')
  replyTo(replyToken, {
    type: 'text',
    text: 'ขิง ข่า ตะใคร้ ใบมะกรูด'
  })
}

const handleUnfollow = (req) => {
  //remove user id in DB
  console.log('someone unfollow us')
}

const webhook = (req, res) => {
  checkEventType(req)
  res.status(200).end()
}

const handleMessage = (req) => {
  const event = req.body.events[0]
  const { replyToken, message } = event
  const userId = event.source.userId
  const messageType = message.type

  if (messageType === 'text') {
    bot.pushMessage(userId, message.text).then(queryResult => {
      const intentName = getIntent(queryResult)
      webhookMessageHandler(intentName, queryResult, replyToken)
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
  const type = req.body.events[0].type
  if (eventMapping[type]) {
    eventMapping[type](req)
  } else {
    console.error("EventType Not implemented " + type)
  }
}

export const replyTo = (replyToken, messageObj) => {
  client.replyMessage(replyToken, messageObj)
}

export const sendTo = (userId, messageObj) => {
  client.pushMessage(userId, messageObj)
}

const getIntent = (queryResult) => queryResult.intent.displayName

export default webhook