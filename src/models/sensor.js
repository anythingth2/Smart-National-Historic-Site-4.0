import mongoose, { Schema } from 'mongoose'

const sensorSchema = new Schema({
  temperature: Number,
  humidity: Number,
  "PIn": Number,
  "POut": Number,
}, {
    timestamps: true
  })

const sensorModel = mongoose.model('sensor', sensorSchema)

export default sensorModel
