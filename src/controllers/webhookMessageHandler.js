import { replyTo, sendTo } from './webhook'
import Sensor from './sensor'

const handleAskCustom = (queryResult, replyToken) => {
  const sensor = queryResult.parameters.fields.sensor.stringValue
  //request data from DB
  Sensor._getEntry(sensor, 1, (err, doc) => {
    //reply
    replyTo(replyToken, {
      type: 'text',
      text: '' + sensor + ' : ' + doc[0][sensor]
    })
  })
}

const handleNormalIntent = (queryResult, replyToken) => {
  console.log('reply : ', queryResult.fulfillmentText)
  replyTo(replyToken, {
    type: 'text',
    text: queryResult.fulfillmentText
  })
}

// Intent router
const handlerList = {
  "ask info - custom": handleAskCustom
}

export default (intent, queryResult, replyToken) => {
  if (handlerList[intent]) {
    handlerList[intent](queryResult, replyToken)
  } else {
    handleNormalIntent(queryResult, replyToken)
  }
}