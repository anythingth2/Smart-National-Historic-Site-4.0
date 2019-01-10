import {
  Client
} from '@line/bot-sdk'
import Bot from '../bot'
import lineMessage from '../lineMessage'
import Sensor from './sensor'
import User from './user'
// import webhookMessageHandler from './webhookDialogflowMessageHandler'
import webhookMessageHandler from './webhookHandler';
import async from 'async'
import axios from 'axios'
import momentjs from 'moment'

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
  const {
    replyToken
  } = event
  let type = event.beacon.type
  //push data to user
  console.log('recive beacon : ', type)
  let obj = {
    beacon : {
      datetime : momentjs().format('YYYY-MM-DD HH:mm:ss'),
      status : type
    }
  }
  replyTo(replyToken,lineMessage.getText(JSON.stringify(obj)))
  callback()
  // if (type == 'enter') {
  //   replyTo(replyToken, {
  //     type: 'flex',
  //     altText: "This is a Flex Message",
  //     contents: JSON.stringify(obj)
  //   })
  //   replyTo(replyToken,lineMessage.getText(JSON.stringify(obj)))
  //   callback()
  // }
  // else {
  //   replyTo(replyToken, lineMessage.getText('Bye'))
  // }
}

const handleFollow = (event, callback) => {
  const {
    replyToken
  } = event
  console.log('someone follow us')
  //add user id to DB
  User.addUser(event.source.userId, 0, (err) => {
    if (err) {
      // Implement
      // response with error status
    } else {
      callback()
    }
  })
}

const handleUnfollow = (event, callback) => {
  const {
    replyToken
  } = event
  console.log('someone unfollow us')
  //remove user id in DB
  User.delUser(event.source.userId, (err) => {
    if (err) {
      // Implement
      // response with error status
    } else {
      callback()
    }
  })
}

const handleMessage = (event, callback) => {
  const {
    replyToken,
    message
  } = event
  const userId = event.source.userId
  const messageType = message.type

  if (messageType === 'text') {
    // bot.pushMessage(userId, message.text).then(queryResult => {
    //   const intentName = getIntent(queryResult)
    //   webhookMessageHandler(intentName, queryResult, replyToken, callback)
    // });
    webhookMessageHandler(event);
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

// User.getAllUser((err,users)=>{
//   console.log(users)
//   muticast(users,{
//     type:'text',
//     text: message.text
//   })
// })

export const multicast = (users, messageObj) => {
  users.forEach(user => {
    sendTo(user.userId, messageObj)
  });
}

export const replyTo = (replyToken, messageObj) => {
  return client.replyMessage(replyToken, messageObj)
}

export const sendTo = (userId, messageObj) => {
  return client.pushMessage(userId, messageObj)
}

const getIntent = (queryResult) => queryResult.intent.displayName

export default webhook