import User from './user'
import {multicast} from './webhook'

const boardCast = (req,res)=>{
    console.log("Board Cast ", req.params.msg)
    User.getAllUser((err,users)=>{
        multicast(users,{
            type:'text',
            text:req.params.msg
        })
    })
    res.send(req.params.msg)
}

export default {
    boardCast
}