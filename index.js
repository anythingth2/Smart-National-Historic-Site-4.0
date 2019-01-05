
var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var webhook = require('./WebhookController')
const middleware = require('@line/bot-sdk').middleware
const lineConfig = require('./line_config.js').config
const Bot = require('./bot');
const test = async () => {


    var bot = new Bot();
    await bot.pushMessage('สวัสดี');
    await bot.pushMessage('ที่ไหน');
    await bot.pushMessage('วัดไตร');
    await bot.pushMessage('วัดไตร');
    console.log('done')
}

test();
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))

console.log("Start Sever .....")



app.post('/webhook', middleware(lineConfig), (req, res) => {
    webhook(req, res)
})

app.listen(8080)