import { User } from '../models'

/**
 * 
 * @param {String} userId 
 * @param {Number} role 
 * @param {Function} callback 
 */

const addUser = (userId, role, callback) => {
  User.create({ userId, role }, err => {
    if (err) {
      console.error(err)
    }
    callback(err)
  })
}

/**
 * 
 * @param {User} userId 
 * @param {Function} callback 
 */

const getUser = (userId, callback) => {
  User.findOne({ userId }, (err, user) => {
    if (err) {
      console.error(err)
    }
    callback(err, user)
  })
}


//Add user example
// User.addUser('123123', 1, err => {
//   if (err) {
//     // Implement
//     // response with error status
//   } else {
//     console.log(user)
//   }
// })

// Get user example
// User.getUser('123123', (err, user) => {
//   if (err) {
//     // Implement
//     // response with error status
//   } else {
//     console.log(user)
//   }
// })

export default {
  addUser,
  getUser
}