import { Beacon } from '../models'

const addEntry = (req, res) => {
  const { datetime, status } = req.body.beacon
  const currentHour = new Date().getHours()
  Beacon.find({ createdAt: {} })
  Sensor.create(sensorData, err => {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      res.status(200).end()
    }
  })
}