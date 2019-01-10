import { replyTo, sendTo } from './webhook'
import Sensor from './sensor'
import lineMessage from '../lineMessage'
import axios from 'axios'

const handleAskCustom = (queryResult, replyToken, callback) => {
  const sensor = queryResult.parameters.fields.sensor.stringValue
  //request data from DB
  Sensor._getEntry(sensor, 1, (err, doc) => {
    //reply
    replyTo(replyToken, lineMessage.getText('' + sensor + ' : ' + doc[0][sensor]))
  })
}

const handleNormalIntent = (queryResult, replyToken, callback) => {
  console.log('reply : ', queryResult.fulfillmentText)
  replyTo(replyToken, lineMessage.getText(queryResult.fulfillmentText)).then(() => {
    callback()
  })
}

// Intent router
const handlerList = {
  "ask info - custom": handleAskCustom
}

export default (intent, queryResult, replyToken, callback) => {
  if (handlerList[intent]) {
    handlerList[intent](queryResult, replyToken, callback)
  } else {
    handleNormalIntent(queryResult, replyToken, callback)
  }
}