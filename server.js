const express=require('express')
const app=express()
const mongoose=require('mongoose')
const Registeruser =require("./model")
const jwt=require('jsonwebtoken')
const middleware = require('./middleware')
const reviewmodel=require('./reviewmodel')

app.use(express.json())
const Port=8080 

mongoose.connect('mongodb+srv://srikanthsaindla:srikanthsaindla@cluster0.utbapnx.mongodb.net/test')
.then(()=>{console.log('MongoDB connected')})
 
app.post('/register' ,async(req,res)=>{
    try{
       const{username,email,password,conformpassword,mobile}=req.body
  
       let exist=await Registeruser.findOne({email})

       if (exist){
        return res.status(400).send("User Already Exist")
       }
       if (password!==conformpassword){
        return res.status(400).send("Password are not Matching")
       }
       if(mobile.length>10){
         return res.status(400).send('Enter Valid number')
       }
       let newUser=new Registeruser({
        username,
        email,
        password,
        mobile,
        conformpassword
       })
        
       await newUser.save()
       res.status(200).send("Register User Sucessfull")

    }catch(e){
        console.log(e)
          
         return res.status(500).send("Register Sever Error")
    }
})
  
app.post('/login',async(req,res)=>{
    try{
  const {email,password}=req.body;
    const exist=await Registeruser.findOne({email})
     
    if(!exist){
        return res.status(400).send('invalid user credential')
    }
    if(password!=exist.password){
          return res.status(400).send('wrong password')
    }
      let payload={
        user:{
            id:exist.id
        }
      }
      jwt.sign(payload,'srikath143',{expiresIn:3600000},
      (err,token)=>{
 if(err) throw err
 return res.json({token})
      })
    }
    catch(e){
        console.log(e.message)
        return res.status(400).send(' server login Error')
    }
})
 
app.get('/allUsers',middleware,async(req,res)=>{

try{
 let allProfiles=await Registeruser.find()
 return res.json(allProfiles)
}
catch(e){
    console.log(e.message)
    res.status(500).send('allUser server Error')
}




})
 
app.get('/myProfile',middleware,async(req,res)=>{
    try{
        let user=await Registeruser.findById(req.user.id)
        return res.json(user)

    }
    catch(e){
        console.log(e.message)
        res.status(500).send('MyProfile server Error')
    }
})

app.post('/addreview',middleware,async(req,res)=>{
    try{

  const {taskworker,rating}=req.body;
  const exist=await Registeruser.findById(req.user.id)
  const newReview=new reviewmodel({
    taskprovider:exist.username,
    taskworker,
    rating
  })
  newReview.save()
  return res.status(200).send('Review updated')

    }
    catch(e){
        console.log(e.message)
        res.status(500).send('addreview server Error')
    }
})

app.get('/myreview',middleware,async(req,res)=>{
    try{
const allreview=await reviewmodel.find();
let myreviews=allreview.filter(rew=>rew.taskworker.toString()===req.user.id.toString())
// console.log(allreview)
// console.log(myreviews)   
return res.status(200).send(myreviews) 
}
    catch(e){
        console.log(e.message)
        res.status(500).send('my Review Sever Error')
    }
})

app.listen(Port,()=>console.log(`sever is running at ${Port}`))