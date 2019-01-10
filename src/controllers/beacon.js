import { Beacon } from '../models'
import moment from 'moment'

const addEntry = (req, res) => {
  let { datetime, status } = req.body.beacon
  datetime = moment(datetime, 'YYYY-MM-DD HH:mm:ss')
  const start = datetime.clone().subtract(1, 'hour').startOf('hour').toDate()
  const end = datetime.clone().subtract(1, 'hour').endOf('hour').toDate()
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

export default {
  addEntry
}