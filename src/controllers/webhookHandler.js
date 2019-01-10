import { replyTo, sendTo } from './webhook';
import Sensor from './sensor';
import lineMessage from '../lineMessage';
import axios from 'axios';

const handleRequestSensor = (event, next) => {
    if (event.message.text == 'Admin_mon') {
        
        replyTo(event.replyToken, {
            type: 'text',
            text: 'SENSOR'
        })
    } else {
        next();
    }
};


const HANDLER_LIST = [handleRequestSensor];

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