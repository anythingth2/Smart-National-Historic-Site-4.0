import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true
  },
  role: Number        //0 Guest 1 Admin
}, {
    timestamps: true
  })

const userModel = mongoose.model('user', userSchema)

export default userModel
