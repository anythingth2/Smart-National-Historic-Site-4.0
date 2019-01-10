import mongoose, { Schema } from 'mongoose'

const beaconSchema = new Schema({
  pIn: {
    type: Number,
    default: 0
  },
  pOut: {
    type: Number,
    default: 0
  },
  datetime: Date
}, {
    timestamps: true
  })

const beaconModel = mongoose.model('beacon', beaconSchema)

export default beaconModel
