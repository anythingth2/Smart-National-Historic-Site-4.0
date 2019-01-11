import { replyTo, sendTo } from './webhook';
import Sensor from './sensor';
import lineMessage from '../lineMessage';
import axios from 'axios';

const handleRequestSensor = (event, next) => {
    if (event.message.text == 'Admin_Mon') {
        Sensor._getLastSensor((err, doc) => {
            replyTo(event.replyToken, {
                type: 'text',
                text: `อุณหภูมิ: ${doc.temperature} c\nความชื้น: ${doc.humidity} % \nจำนวนคนเข้า: ${doc.pIn} คน\nจำนวนคนออก: ${doc.pOut} คน`
            })
        });
    } else {
        next();
    }
};

const handleEcho = (event,next)=>{
    replyTo(event.replyToken,lineMessage.getText(event.message.text))
    next()
}

const HANDLER_LIST = [handleRequestSensor,handleEcho];

const handler = (event) => {
    var isBreak = true;
    for (var i = 0; i < HANDLER_LIST.length; i++) {
        isBreak = true;
        HANDLER_LIST[i](event, () => { isBreak = false });
        if (isBreak)
            break;
    }
}

export default handler;