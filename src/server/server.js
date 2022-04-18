import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { dbName: "love_for_the_uglies" })
mongoose.connection.on('error', err => {
  throw new Error(`Unable to connect to database: ${config.mongoUri} ` + err)
})

app.listen(config.port, (err) => {
  console.info("Database URI: " + config.mongoUri);

  if (err) {
    console.log(err)
  }

  console.info("Server running on port " + config.port);
})
