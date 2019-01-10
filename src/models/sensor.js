import mongoose, { Schema } from 'mongoose'

const sensorSchema = new Schema({
  Temperature: Number,
  Humidity: Number,
  "P-IN": Number,
  "P-OUT": Number,
}, {
    timestamps: true
  })

const sensorModel = mongoose.model('sensor', sensorSchema)

export default sensorModel
