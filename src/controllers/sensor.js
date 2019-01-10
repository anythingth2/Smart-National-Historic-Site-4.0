import { Sensor } from '../models'
import moment from 'moment'

const hexToDec = (hex) => {
  var val = parseInt('0x' + hex, 16)
  if ((val & 0x8000) > 0) {
    val = val - 0x10000;
  }
  return val
}

const parseData = (data) => {
  return {
    temperature: hexToDec(data.substring(4, 8)) / 10.0,
    humidity: hexToDec(data.substring(12, 14)) / 2.0,
    pIn: hexToDec(data.substring(18, 22)) / 100,
    pOut: hexToDec(data.substring(26, 30)) / 100
  }
}

const _addEntry = (req, res) => {
  const sensorData = req.body
  Sensor.create(sensorData, err => {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      res.status(200).end()
    }
  })
}

const addEntry = (req, res) => {
  const rawData = req.body.DevEUI_uplink.payload_hex
  const sensorData = parseData(rawData)
  Sensor.create(sensorData, err => {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      res.status(200).end()
    }
  })
}

/**
 * 
 * @param {String} select 
 * @param {Number} limit 
 * @param {Function} callback 
 */

const _getEntry = (select, limit, callback) => {
  let findQuery = Sensor.find({}).sort({ createdAt: -1 })
  if (limit && !isNaN(limit = parseInt(limit))) {
    findQuery = findQuery.limit(limit)
  }
  findQuery.select((select || '-_id -__v')).exec(callback)
}

const _getLastSensor = (callback) => {
  Sensor.find({}).sort({ createdAt: -1 }).limit(1).exec((err, last) => {
    const start = moment().subtract(1, 'hour').toDate()
    const end = moment().subtract(1, 'hour').toDate()
    last = last[0]
    Sensor.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    }, (err, docs) => {
      let pIn = 0
      let pOut = 0
      docs.forEach(d => {
        pIn += d.pIn ? d.pIn : 0
        pOut += d.pOut ? d.pOut : 0
      })
      last.pIn = pIn
      last.pOut = pOut
      callback(err, last)
    })
  })

}


const getLastSensor = (req, res) => {
  _getLastSensor((err, doc) => {
    if (err) {
      console.error(err)
      res.status(500).json({
        success: false
      })
    } else {
      res.json({
        success: true,
        data: doc
      })
    }
  })
}

export default {
  addEntry,
  getLastSensor,
  _addEntry,
  _getEntry,
  _getLastSensor
}