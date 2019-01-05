import { Sensor } from '../models'

const DataType = ['73', '67', '68', '71', '86', '02']

const splitData = (data, e) => {
  const results = []
  const findMatch = (data, n, e) => {
    if (n >= e) { return }
    const matchIndex = data.match('0' + n + DataType[n]).index
    data = data.substr(matchIndex + 4)
    const endIndex = data.indexOf('0' + (n + 1) + DataType[n + 1])
    const splitedData = data.substring(0, endIndex !== -1 ? endIndex : data.length)
    results.push(splitedData)
    findMatch(data, n + 1, e)
  }
  findMatch(data, 0, e)
  return results
}

const hexToDec = (hex) => {
  var val = parseInt('0x' + hex, 16)
  if ((val & 0x8000) > 0) {
    val = val - 0x10000;
  }
  return val
}

const parseData = (data) => {
  return {
    barometer: hexToDec(data[0]) / 10.0,
    temperature: hexToDec(data[1]) / 10.0,
    humidity: hexToDec(data[2]) / 2.0,
    Accelometer: {
      x: hexToDec(data[3].substring(0, 4)) / 1000,
      y: hexToDec(data[3].substring(4, 8)) / 1000,
      z: hexToDec(data[3].substring(8, 12)) / 1000,
    },
    gyrometer: {
      x: hexToDec(data[4].substring(0, 4)) / 100,
      y: hexToDec(data[4].substring(4, 8)) / 100,
      z: hexToDec(data[4].substring(8, 12)) / 100
    },
    magnatic: hexToDec(data[5]) / 100
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
  const rawData = req.body.DevEUI_uplink.payload_hex.substring(0, 62)
  const sensorData = parseData(splitData(rawData, 6))
  console.log(sensorData)
  Sensor.create(sensorData, err => {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      res.status(200).end()
    }
  })
}

const _getEntry = (select, limit, callback) => {
  let findQuery = Sensor.find({}).sort({ createdAt: -1 })
  if (limit && !isNaN(limit = parseInt(limit))) {
    findQuery = findQuery.limit(limit)
  }
  findQuery.select((select || '-_id -updateAt -__v')).exec(callback)
}

const getEntry = (req, res) => {
  let { limit, select } = req.query
  _getEntry(limit, select, (err, doc) => {
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
  getEntry,
  _addEntry,
  _getEntry
}