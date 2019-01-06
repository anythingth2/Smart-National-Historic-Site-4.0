import './db'
import express from 'express'
import bodyParser from 'body-parser'
import { middleware } from '@line/bot-sdk'
import webhook from './controllers/webhook'
import Api from './routes'
import http from 'http'
import https from 'https'
import fs from 'fs'

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


if (process.env.NODE_ENV === 'prod') {
  http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
  const { HTTPS_KEY, HTTPS_CERT, HTTPS_CA } = process.env
  const options = {
    key: fs.readFileSync(HTTPS_KEY),
    cert: fs.readFileSync(HTTPS_CERT),
    ca: fs.readFileSync(HTTPS_CA)
  };
  https.createServer(options, app).listen(443, () => {
    console.log('Server listening on port ' + 443 + ' in prod mode');
  })
} else {
  app.listen(8080, function () {
    console.log('Server listening on port ' + 8080 + ' in dev mode');
  })
}