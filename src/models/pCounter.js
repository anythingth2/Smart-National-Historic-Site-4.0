import mongoose, { Schema } from 'mongoose'

const pCounterSchema = new Schema({
  pIn: {
    type: Number,
    default: 0
  },
  pOut: {
    type: Number,
    default: 0
  },
  datetime: Date
})

const pCounterModel = mongoose.model('pcounter', pCounterSchema)

export default pCounterModel
