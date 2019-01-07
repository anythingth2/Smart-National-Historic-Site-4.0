import {
  Client
} from '@line/bot-sdk'
import Bot from '../bot'
import card from '../card'
import Sensor from './sensor'
import User from './user'
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
  console.log('someone follow us')
  //add user id to DB
  User.addUser(event.source.userId,0)
  
}

const handleUnfollow = (req) => {
  console.log('someone unfollow us')
  //remove user id in DB

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

// ================================ 

const eventMapping = {
  message: handleMessage,
  beacon: handleBeacon,
  follow: handleFollow,
  unfollow: handleUnfollow
}

const webhook = (req, res) => {
  checkEventType(req)
  res.status(200).end()
}

const checkEventType = (req) => {
  const type = req.body.events[0].type
  if (eventMapping[type]) {
    eventMapping[type](req)
  } else {
    console.error("EventType Not implemented " + type)
  }
}

export const muticast = (userIdlist,messageObj) => {
  userIdlist.forEach(userId => {
    sendTo(userId,messageObj)
  });
}

export const replyTo = (replyToken, messageObj) => {
  client.replyMessage(replyToken, messageObj)
}

export const sendTo = (userId, messageObj) => {
  client.pushMessage(userId, messageObj)
}

const getIntent = (queryResult) => queryResult.intent.displayName

export default webhook