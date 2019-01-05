var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var webhook = require('./WebhookController')
const middleware = require('@line/bot-sdk').middleware
const config = require('./line_config.js').config

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))

console.log("Start Sever .....")



app.post('/webhook', middleware(config), (req, res) => {
    webhook(req, res)
})

app.listen(8080)