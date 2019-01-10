import mongoose from 'mongoose'

if (process.env.DB_USER) {
  mongoose.connect("mongodb://"
    + process.env.DB_USER
    + ":" + process.env.DB_PASS
    + "@" + process.env.DB_HOST
    + "/" + process.env.DB_DATABASE, {
      auth: {
        authdb: 'admin'
      },
      useNewUrlParser: true,
      poolSize: 20
    })
} else {
  mongoose.connect("mongodb://" + process.env.DB_HOST + "/" + process.env.DB_DATABASE, {
    poolSize: 20,
    useNewUrlParser: true
  })
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to mongo server.');
})

export default db;