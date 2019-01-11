import { Beacon, pCounter } from '../models'
import Line from './line'
import moment from 'moment'

const runEveryStartHour = () => {
  setInterval(() => {
    const m = moment()
    if (m.minute() === 0 && m.second() === 0) {
      setTimeout(() => {
        const start = moment().startOf('hour').toDate()
        const end = moment().endOf('hour').toDate()
        Beacon.findOne({
          createdAt: {
            $gte: start,
            $lte: end
          }
        }, (err, doc) => {
          if (!doc) {
            const newData = { pIn: 0, pOut: 0, datetime: start }
            Beacon.create(newData, (err) => {
              if (err) {
                console.error(err)
                res.status(500).json({
                  success: false
                })
              } else {
                console.log("Created new row")
              }
            })
          }
        })
      }, 100)
    }
  }, 100)
}

runEveryStartHour()

const addEntry = (req, res) => {
  let { datetime, status } = req.body.beacon
  datetime = moment(datetime, 'YYYY-MM-DD HH:mm:ss')
  const start = datetime.clone().startOf('hour').toDate()
  const end = datetime.clone().endOf('hour').toDate()
  Beacon.findOne({
    createdAt: {
      $gte: start,
      $lte: end
    }
  }, (err, doc) => {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      if (doc) {
        if (status === 'enter') {
          doc.pIn += 1
        } else {
          doc.pOut += 1
        }
        doc.datetime = datetime.toDate()
        updatePCounter(status)
        doc.save(() => {
          res.json({
            success: true
          })
        })
      } else {
        const newData = status === 'enter' ? { pIn: 1, datetime } : { pOut: 1, datetime }
        Beacon.create(newData, (err) => {
          if (err) {
            console.error(err)
            res.status(500).json({
              success: false
            })
          } else {
            res.json({
              success: true
            })
          }
        })
      }
    }
  })
}

const updatePCounter = (status) => {
  pCounter.findOne({}, (err, doc) => {
    if (err) {
      console.error(err)
    }
    if (doc) {
      if (status === 'enter') {
        doc.pIn += 1
      } else {
        doc.pOut += 1
      }
      doc.save()
      if (doc.pIn - doc.pOut > 2 && status === 'enter') {
        Line.alertPeopleLimt()
      }
    } else {
      pCounter.create(status === 'enter' ? { pIn: 1 } : { pOut: 1 }, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
  })
}

const getLog = (req, res) => {
  let { hours } = req.query
  const start = moment().subtract(parseInt(hours), 'hour').startOf('hour').toDate()
  const end = moment().subtract(1, 'hour').endOf('hour').toDate()
  Beacon.find({
    createdAt: {
      $gte: start,
      $lte: end
    }
  }).sort({ createdAt: 1 }).exec((err, docs) => {
    if (err) {
      console.error(err)
      res.status(500).end()
    }
    if (docs.length < hours) {
      res.status(400).end()
    } else {
      let data = docs.map(d => d.pIn.toString())
      res.json({
        success: true,
        number_of_tourist: data
      })
    }
  })
}

export default {
  addEntry,
  getLog
}