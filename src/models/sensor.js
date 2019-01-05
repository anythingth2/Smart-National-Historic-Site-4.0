import mongoose, { Schema } from 'mongoose'

const sensorSchema = new Schema({
  barometer: Number,
  temperature: Number,
  humidity: Number,
  accelometer: {
    x: Number,
    y: Number,
    z: Number
  },
  gyrometer: {
    x: Number,
    y: Number,
    z: Number
  },
  magnatic: Number
}, {
    timestamps: true
  })

const sensorModel = mongoose.model('sensor', sensorSchema)

export default sensorModel
