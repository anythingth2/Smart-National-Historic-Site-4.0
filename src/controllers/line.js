import User from './user'
import {multicast} from './webhook'
import lineMessage from '../lineMessage'

const boardCast = (req, res) => {
    let msg = req.params.msg
    console.log("Board Cast ", msg)

    User.getAllUser((err,users)=>{
        let messageObj = lineMessage.getText(msg)
        if(msg == 'fun'){
            let img = 'https://i.dailymail.co.uk/i/pix/2015/01/25/250D5C3500000578-0-image-m-4_1422226010904.jpg'
            let url = 'https://www.google.co.th/search?biw=1229&bih=539&tbm=isch&sa=1&ei=MuY0XOyWLYXKvgTW1KbwBw&q=%E0%B9%81%E0%B8%A1%E0%B8%A7%E0%B8%99%E0%B9%89%E0%B8%9E&oq=%E0%B9%81%E0%B8%A1%E0%B8%A7%E0%B8%99%E0%B9%89%E0%B8%9E&gs_l=img.3..0l10.617663.618313..618428...0.0..0.83.365.5......1....1..gws-wiz-img.......35i39.DFaec2LfV1g#imgrc=U5W-VuCGofmtvM:'
            messageObj = {
                type: 'flex',
                altText: "This is a Flex Message",
                contents: lineMessage.getCustomFlex(img,url,'Arrrrrrrrrrrr','','')
              }
        }
        multicast(users, messageObj)
    })
    res.send(msg)
}

export default {
    boardCast
}