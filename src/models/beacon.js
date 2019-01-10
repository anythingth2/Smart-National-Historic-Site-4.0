import mongoose, { Schema } from 'mongoose'

const beaconSchema = new Schema({
  "P-IN": Number,
  "P-OUT": Number,
}, {
    timestamps: true
  })

const beaconModel = mongoose.model('beacon', beaconSchema)

export default beaconModel
