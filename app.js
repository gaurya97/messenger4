var express = require("express");
var path = require("path");
const dbconnect = require("./routes/dbconfig");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
let { Server } = require("socket.io");
var http = require("http");
var indexrouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { Socket } = require("dgram");
let websocketid;
var app = express();
let server = http.createServer(app);
let io = new Server(server);

io.on("connection", (Socket) => {
  console.log("new user connected");
  console.log(Socket.id);
  websocketid = Socket.id;
  Socket.emit("updateid", Socket.id);

  Socket.on("newuserid", (e) => {
    let el = JSON.stringify(e);
    let bl = JSON.parse(el);
    console.log(`my user name ${bl.userid},${bl.socketid}`);
    io.emit("onlineuser", bl.userid);
    dbconnect.query(
      `update login_users set socketid ='${bl.socketid}',status='online' where userid ='${bl.userid}'`
    );

    // io.emit('newuserid1',{
    //     usersocketid:e.socketid,
    //     userid:e

    //  })
  });

Socket.on('typestat',(e)=>{
    console.log(e)
    dbconnect.query(`select socketid from login_users where userid ='${e.reciverid}'`,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            
            Socket.to(result[0].socketid).emit('typpingstat',e.senderid
                );
        }
    })
})
Socket.on('typestat1',(e)=>{
    // console.log('statt1',e)
    dbconnect.query(`select socketid from login_users where userid ='${e.reciverid}'`,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            
            Socket.to(result[0].socketid).emit('typpingstat1',e.senderid);
        }
    })
})


  Socket.on("sendMessege", (e) => {
    console.log(e.senderid,e.sendersocketid, e.recceiverid, e.msg);
    dbconnect.query(`select socketid from login_users where userid ='${e.recceiverid}'`,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(result[0].socketid)
            Socket.to(result[0].socketid).emit('reccivemessage',{msg:e.msg,senderid:e.senderid,
                sendersocketid:e.sendersocketid});
        }
    })
    dbconnect.query(`insert into messeges (sender,msg,recever) values('${e.senderid}','${e.msg}','${e.recceiverid}')`)

  });

  Socket.on("disconnect", () => {
    console.log(`disconnect ${Socket.id}`);
    let currentdate = new Date();
    const dateoption = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const formateddate = currentdate
      .toLocaleString("en-IN", dateoption)
      .replace(/,/g, "");
    console.log(formateddate);
    dbconnect.query(
      `update login_users set status='${formateddate}' where socketid ='${Socket.id}'`
    );
    dbconnect.query(
      `select userid from login_users where socketid ='${Socket.id}'`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${result[0]?.userid} goes offline`);
          io.emit("offlineuser", result[0]?.userid);
        }
      }
    );
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors({ origin: ["http://127.0.0.1:3000"] }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexrouter);
app.use("/users", usersRouter);

module.exports = { app: app, server: server };
