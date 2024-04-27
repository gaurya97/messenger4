var express = require('express');
var router = express.Router();
const EventEmitter =require('events');
const event = new EventEmitter();
const { Server, Socket } = require('socket.io');
const flash =require('connect-flash');
// require('dotenv').config();
// const twilio =require('twilio')
const dbconnect =require('./dbconfig');
// const accountSid=process.env.twilio_acc_sid;
// const accountToken=process.env.twilio_auth_token;
// const ac_number=process.env.twilio_phone_number;
// let client =new twilio(accountSid,accountToken)
const jwt =require('jsonwebtoken');
// console.log(`your env var ${accountSid}`);
let secret_key='mynamegaurav';

let userid;
/* GET home page. */
let total_users=[]
const isuserverified =(req,res,next)=>{
     const token =req.cookies.token;
     jwt.verify(token,secret_key,(err,decoded)=>{
      if(err){
        console.log(err)
        res.redirect('/login')
      }
      else{
        req.user=decoded
        // if(!total_users.some((e)=>{
        //   return e===decoded.userid
        // })){
        //   total_users.push(decoded.userid);
        //   userid=decoded.userid
        // }
        dbconnect.query(`select userid from login_users where userid='${decoded.userid}'`,(err,results)=>{
          if(err){
            console.log(err)
          }
          else{
            if(results.length<=0){
              event.emit('newuser',decoded.userid)
              dbconnect.query(`insert into login_users (username,userid) values('${decoded.username}','${decoded.userid}')`,(err,result)=>{
                if(err){
                  console.log(err)
                }
                else if(result.length>0){
                  
                  next();
                }
              });

            }
           
          }
          next()
        })
       
      }
     })
}

console.log('hii i from middleware')

// router.get('/register', function(req, res, next) {
//   res.render('register');
// });
router.post('/register',(req,res)=>{
   try {
    dbconnect.query(
      `insert into jwt_auth (username,userid,phoneno,password) values('${req.body.username}','${req.body.userid}','${req.body.mobile}','${req.body.password}')`,(err,results)=>{
           if(err){
            res.send('something went wrong');
            console.log(err)
           }
           else{
            req.flash('err','Register Succesfully Please Login To Continued')
            res.redirect('/login');
           }
      }
    )
   } catch (error) {
    res.sendStatus(500).send('something went wrong');
   }
})
// io.on('connection',(con)=>{
//    console.log(con)
// })
router.get('/login',(req,res)=>{
  
      res.render('login',msg = req.flash('err'))
      
})
router.post('/login',(req,res)=>{
  dbconnect.query(`select * from jwt_auth where userid ='${req.body.userid}'`,(err,result)=>{
    if(err){
      console.log(err)
    }
    else if(result.length==0){
      req.flash('err','Invalid Username')
        res.redirect('/login');
    }
    else{
      console.log(result);
      console.log(result[0].password);
      if(req.body.password===result[0].password){
        let user={
          username:result[0].username,
          userid:result[0].userid
        }
        jwt.sign(user,secret_key,{expiresIn:'15m'},(err,token)=>{
          if(err){
            console.log(err)
          }
          else{
            res.cookie('token',token,{httpOnly:true,secure:false});
            res.redirect('/profile')
          }
        })

      }
      else{
        req.flash('err','Invalid Password')
       res.redirect('/login')
      }
    }

  })

})

router.get('/userlogupdate',(req,res)=>{

  res.setHeader('Content-Type','text/event-stream');
    res.setHeader('Access-Control-Allow-Origin','*');


    event.on('newuser',(e)=>{
      console.log(`fromuserlogupdate:${e}`)
      res.write(`data:${JSON.stringify(e)}\n\n`)
    
    })
  })




router.get('/profile',isuserverified,(req,res)=>{
 
    dbconnect.query(`select userid,status from login_users`,async(err,results)=>{
      if(err){
        console.log(err)
      }
      else if(results.length>0){
        let newuser =results.filter((e)=>{
  return e.userid != req.user.userid
})

console.log(results[0].userid)
console.log(req.user.userid)
res.render('profile',{
  users:newuser,
  userid:req.user.userid,

})



       
      }
    })
   
    
 
 
  })



  // console.log(req.user.userid);
  // console.log(total_users);
  // console.log(req.socketId)



router.post('/loadmesseges',(req,res,next)=>{
      console.log(req.body);
      dbconnect.query(`select sender,msg,time from messeges where sender in('${req.body.sendid}','${req.body.reciverid}') and recever in('${req.body.sendid}','${req.body.reciverid}') order by id`,(err,result)=>{
        if(err){
          console.log(err)
        }
        else{
          console.log(result)
          res.send({msg:result});
        }
      })
      
})
// router.get('/sendotp',async(req,res)=>{
//  await client.messages.create({
//     body:'hey gaurav your otp is 098756',
//     to:"+917769881659",
//      from:ac_number
//   })
//   return res.status(200).json({
//     msg:'otp sent succesfully'
//   })
// })
module.exports = router;
