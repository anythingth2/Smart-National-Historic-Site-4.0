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