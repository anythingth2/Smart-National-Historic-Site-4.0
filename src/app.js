import './db'
import express from 'express'
import bodyParser from 'body-parser'
import { middleware } from '@line/bot-sdk'
import webhook from './controllers/webhook'
import Api from './routes'

const { channelAccessToken, channelSecret } = process.env

const app = express()

app.use('/webhook', middleware({ channelAccessToken, channelSecret }), webhook)

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use('/api', Api)

app.get('/', (req, res) => {
  res.send('Hi')
})

app.listen(8080, () => {
  console.log("Server started at port 8080")
})