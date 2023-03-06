const jwt=require('jsonwebtoken')

//for auth 400
//server error 500
module.exports=function(req,res,next){
    try{
let token=req.header('x-token')
console.log(token)
if(!token){
 return res.status(400).send('Token not Found')
 
}

let decode=jwt.verify(token,'srikath143')
 
  req.user=decode.user;
  next()
    }
    catch(e){
        console.log(e.message)
        res.status(400).send('jwt server Error')
    }
}