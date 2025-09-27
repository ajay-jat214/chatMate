const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
var multer = require("multer");
var path = require("path");
const socketio = require("socket.io");
const axios =require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authToken = require('./verifyToken.js');
const amqp = require('amqplib');
const redis =  require('redis');
const redisClient = redis.createClient();

require('dotenv').config();
const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var ImageKit = require("imagekit");

let connectedUsers = [], connectedUserCredentials={};

redisClient.on('error',err => console.log('Redis client error: ',err));
redisClient.connect(console.log('redis connected'));

redisClient.set('mystring', 'Hello, Redis!', (err, reply) => {
    if (err) throw err;
    //console.log(reply); // Should print "OK"
});
// Get the string value
redisClient.get('mystring', (err, reply) => {
    if (err) throw err;
    //console.log(reply); // Should print "Hello, Redis!"
});

const client=mongoose.connect(
  process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.MONGOLAB_URI ||
    "mongodb+srv://ajay:ajstyles89@cluster0.zvrc2.mongodb.net/alumini-student?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (req, res) => {
    console.log("connected to database");
  }
);


var imagekit = new ImageKit({
    publicKey : "public_RELv2MmXmSGi+gzUXw/BJwsnAzw=",
    privateKey : "private_+kBApO3dM4APoNkzRQ1mfRhb4kg=",
    //publicKey : "public_qAqJbtWn0t8PBCHPDJ+pGX0rb1U=",
    //privateKey : "private_xUh01lx+s79GXac7aKyGUPjcvpY=",
    urlEndpoint : "https://ik.imagekit.io/jatajay004/"
});

const { MONGOURI } = require("./config/keys");
var User2 = require("./addAlumini");
var User = require("./signin");
var Chat = require("./chat");
var User4 = require("./calendar");
var Image = require("./uploadImage");

async function startServer(){
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  next();
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});


app.get('/auth',authToken,(req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.status(200).send(result);
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const server = http.createServer(app);
const io = socketio(server);

app.get("/getImage",authToken, (req, res) => {
  let fetchedEmail="";

  if(req.query.email)
    fetchedEmail = req.query.email;

  if(fetchedEmail){
    Image.find({email:req.query.email}, (err, data) => {
      if (err) return res.status(204).json("error:server error");
      return res.status(200).json({
        message: "success",
        values: data,
      });
    });
  }
  else{
    Image.find({}, (err, data) => {
      if (err) return res.status(204).json("error:server error");
      return res.status(200).json({
        message: "success",
        values: data,
      });
    });
  }

});

app.post("/fetchStamp",authToken, (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
    const obj = JSON.parse(body);
    const { email, emailCredentials } = obj;
    Chat.find(
      {
        $or: [
          { toEmail: email, fromEmail: emailCredentials },
          { toEmail: emailCredentials, fromEmail: email },
        ],
      },
      (err, previous) => {
        res.status(200).json(previous);
      }
    );
  });
});
app.post("/uploadImage",authToken,  async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
      body += chunk.toString();
      const obj = JSON.parse(body);
      const { imagePath,fileId } = obj;
      const { email } =req.query;
      //console.log(obj,req.query); 
      Image.find({email:email},(err,prevValue)=>{
       
        if(prevValue.length==0){
          const newUser= new Image();
          newUser.image=imagePath;
          newUser.fileId=fileId;
          newUser.email=email;
          newUser
            .save()
            .then((doc)=>{
                if (doc.image.length)
                  res.status(201).json({
                    message: "Profile Image uploaded successfully",
                    results: doc,
                  });
            })
            .catch(err=>res.status(404).json({message:"Error while creating new object",results:err}))
        }else{
            const fileIdForDelete=prevValue[0].fileId;
            imagekit.deleteFile(fileIdForDelete,(error, result)=> {
                if(error) console.log(error);
                else console.log("Image deleted from imagekitio successfully",result);
            })

            const updateFields={
              image:imagePath,
              fileId:fileId,
              email:email,
            }
            Image.findOneAndUpdate({email:email},updateFields,{new:true,useFindAndModify:false},(err,doc)=>{
              if(err)
                res.status(404).send(err);
              else
                res.status(200).send(doc);
            })
      }
      })

    })
});

app.post("/uploadChattingImage",authToken,  async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
      body += chunk.toString();
      const obj = JSON.parse(body);
      const { email, imagePath,fileId } = obj;
      
      Image.find({email:`${email}:chat`},(err,prevValue)=>{
       
        if(prevValue.length==0){
          const newUser= new Image();
          newUser.image=imagePath;
          newUser.fileId=fileId;
          newUser.email=`${email}:chat`;
          newUser
            .save()
            .then((doc)=>{
                if (doc.image.length)
                  res.status(201).json({
                    message: "Profile Image uploaded successfully",
                    results: doc,
                  });
            })
            .catch(err=>res.status(404).json({message:"Error while creating new object",results:err}))
        }else{
            const fileIdForDelete=prevValue[0].fileId;
            imagekit.deleteFile(fileIdForDelete,(error, result)=> {
                if(error) console.log(error);
                else console.log("Image deleted from imagekitio successfully",result);
            })

            const updateFields={
              image:imagePath,
              fileId:fileId,
              email:`${email}:chat`,
            }
            Image.findOneAndUpdate({email:`${email}:chat`},updateFields,{new:true,useFindAndModify:false},(err,doc)=>{
              if(err)
                res.status(404).send(err);
              else
                res.status(200).send(doc);
            })
      }
      })

    })
});

app.get("/fetchUsers",authToken, (req, res) => {
  let users;
    redisClient.get("users")
    .then(async()=>{
	users= await redisClient.get("users")
        //console.log("check indirect async = ",users);
        //if(users.length){
        //   return res.status(200).json({
        //      message: "success",
        //      values: JSON.parse(users),
        //   });
        //}

    });

  //if(users.length){
  //  return res.status(200).json({
  //    message: "success",
  //    values: users,
  //  });
  //}
  
  if(users){
        if(users.length){
           return res.status(200).json({
              message: "success",
              values: JSON.parse(users),
           });
        }
  } 

  User2.find({}, (err, users) => {
    if (err) return res.status(204).json("error:server error");

    /*****************REDIS********************/
    //redisClient.set("users",JSON.stringify(users))
    //.then(async()=>{
    //    console.log("check indirect async = ",await redisClient.get("users"));
    //    return redisClient.get("users");
    //})
    //.then((stored)=>{
    //    console.log("credentials saved successfully:",stored);
    //});

    //redisClient.get("users")
    //.then(async()=>{
    //    console.log("check indirect async = ",await redisClient.get("users"));
    //})
    //.then((stored)=>{
    //    console.log("credentials saved successfully:",stored);
    //});
    //const storedUsers = JSON.parse(raw);
    //console.log("fetchedUsers",storedUsers);
    /****************REDIS**********************/

    return res.status(200).json({
      message: "success",
      values: users,
    });
  });
});

app.post("/signin", async(req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string
    const obj = JSON.parse(body);
    const { password } = obj;
    
    let { email } = obj;
    if (!password) {
      return res.status(200).json("error:password cannot be blank");
    }

    if (!email) {
      return res.status(200).json("error:email cannot be blank");
    }

    email = email.toLowerCase();

    /*****************REDIS********************/ 
    //const redisUser = {email:email,password: password};
    //var refreshToken=0;
    //var storedToken=0;
    //redisClient.set(`refresh:${email}`,refreshToken,{ EX: 60*60*2 })
    //.then(async()=>{
//	console.log("check indirect async = ",await redisClient.get(`refresh:${email}`));
//	return redisClient.get(`refresh:${email}`);
    //})
    //.then((stored)=>{
//	console.log("credentials saved successfully:",stored);
    //});
    //const a = `refresh:${email}`;
    //redisClient.get(`refresh:${email}`).then((value)=>{
//	console.log("refresh:",refreshToken);
//	console.log("shared:",value);
    //});
    /****************REDIS**********************/

    //console.log(email,password);
    User2.find(
      {
        email: email,
      },
      (err, users) => {
        if (err) {
	 console.log(err);
         return res.status(501).json("server error");
        }

        if (users.length != 1) {
          return res.status(204).json("Invalid user");
        }

        const user = users[0];

        if (!user.comparePassword(password)) {
          return res.status(200).json("password doesn't matched");
        }
        const token=jwt.sign(
          {user_id:user.id,email},
          process.env.TOKEN_KEY,
          {
            expiresIn:"2h"
          }
        );
        
        User2.findOneAndUpdate({email:email},{token:token},{useFindAndModify:false,new:true},(err,doc)=>{
          if(err)
            res.status(404).send(err);
          else{
            const decoded=jwt.verify(token,process.env.TOKEN_KEY);
            res.status(200).send({message:"success",userName:doc.userName,exp:decoded.exp,token:token});
          }
        })
        // return res.json({
        //   message: "success",
        //   email: email,
        //   userName: user.userName,
        // });
      }
    ).catch((err) => console.log("yes errorr"));
  });
});

app.post("/admin", async (req, res) => {
  console.log("/admin called");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string
    const obj = JSON.parse(body);
    const {
      firstName,
      lastName,
      password,
      userName,
      field,
      company,
      phone,
      placementYear,
    } = obj;
    let { email } = obj;
    email = email.toLowerCase();
    if (!password) {
      return res.status(200).json("error:password cannot be blank");
    }

    if (!email) {
      return res.status(200).json("error:email cannot be blank");
    }
  
    User2.find(
      {
        email: email,
      },
      async (err, previousUser) => {
        if (err) {
          return res.status(200).json("error1:server error");
        }

        if (previousUser.length > 0) {
          return res.status(200).json("User already exists ");
        }

        // const newUser = new User2();
        // newUser.email = email;
        // newUser.password = newUser.generateHash(password);
        // newUser.firstName = firstName;
        // newUser.lastName = lastName;
        // newUser.userName = userName;
        // newUser.field = field;
        // newUser.company = company;
        // newUser.phone = phone;
        // newUser.placementYear = placementYear;
        try{
            const userDetails={
              firstName:firstName,
              lastName:lastName,
              email:email,
              password:bcrypt.hashSync(password,8),
              userName:userName,
              field:field,
              company:company,
              placementYear:placementYear,
              phone:phone,
            };
            let createdUser=await User2.create(userDetails);

            const token = jwt.sign(
              { user_id: createdUser._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );
            const updateField={
              token:token,
            };
            User2.findOneAndUpdate({email:email},updateField,{useFindAndModify:true,new:true},(err,doc)=>{
              if(err)
                res.status(404).send(err);
              else
                res.status(200).send({message:"success",doc});
            })
            createdUser.token=token;
        }catch(err){
            console.log(err);
        }

        // newUser.save((err, user) => {
        //   if (err) {
        //     return res.json("error3:server error");
        //   }
        //   return res.json({
        //     message: "success",
        //     email: email,
        //   });
        // });
      }
    ).catch((err) => console.log("errorr"));
  });
});

app.post("/deleteUser", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string

    const obj = JSON.parse(body);

    const { email, array } = obj;

    Chat.find(
      {
        $or: [{ toEmail: email }, { fromEmail: email }],
      },
      (err, previous) => {
        for (let i = 0; i < previous.length; i++)
          previous[i].deleteOne({ _id: previous[i]._id });
      }
    );
    User4.find(
      {
        email: email,
      },
      (err, previous) => {
        for (let i = 0; i < previous.length; i++)
          previous[i].deleteOne({ _id: previous[i]._id });
      }
    );
    User.find(
      {
        email: email,
      },
      (err, previous) => {
        for (let i = 0; i < previous.length; i++)
          previous[i].deleteOne({ _id: previous[i]._id });
      }
    );
    Image.find(
      {
        email: email,
      },
      (err, previous) => {
        for (let i = 0; i < previous.length; i++)
          previous[i].deleteOne({ _id: previous[i]._id });
      }
    );
    res.status(200).json("success");
  });
});

app.post("/messaging",authToken, (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string

    const obj = JSON.parse(body);

    const { emailCredentials } = obj;
    const { email } = obj;
    Chat.find(
      {
        $or: [
          { toEmail: email, fromEmail: emailCredentials },
          { toEmail: emailCredentials, fromEmail: email },
        ],
      },
      (err, previous) => {
        res.status(200).json(previous);
      }
    );
  });
});

app.post("/newmessage",authToken, (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string

    const obj = JSON.parse(body);

    const { emailCredentials } = obj;
    const { email } = obj;
    const { messageLength } = obj;

    Chat.find(
      {
        $or: [
          { toEmail: email, fromEmail: emailCredentials },
          { toEmail: emailCredentials, fromEmail: email },
        ],
      },
      (err, previous) => {
        if (messageLength !== previous.length) res.status(200).json(previous);
      }
    );
  });
});

app.post("/fetchCalendar",authToken, (req, res) => {
  
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string

    const obj = JSON.parse(body);

    const { id, email, title, startDate, endDate, backgroundColor } = obj;

    User4.find(
      {
        email: email,
      },
      (err, previous) => {
        const newCalendar = new User4();
        newCalendar.email = email;
        newCalendar.title = title;
        newCalendar.startDate = startDate;
        newCalendar.endDate = endDate;
        newCalendar.backgroundColor = backgroundColor;
        newCalendar.save((err, event) => {
          if (err) {
            res.status(200).json("error:server error");
          }

          res.status(200).json("success");
        });
      }
    );
  });
});

app.post("/fetchEvents",authToken, (req, res) => {

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString(); // convert Buffer to string

    const obj = JSON.parse(body);
    const { email } = obj;

    User4.find(
      {
        email: email,
      },
      (err, previous) => {
        res.status(200).json(previous);
      }
    ).catch((err) => console.log(err));
  });
});

app.post("/update",authToken, (req, res) => {
  Calendar.find(
    {
      _id: req.body.sessionId,
    },
    (err, prev) => {
      if (err) {
        console.log(err);
      }
      if (prev[0].length) {
        prev[0].title = req.body.title;
        prev[0].email = req.body.email;
        prev[0].startDate = req.body.startDate;

        prev[0].endDate = req.body.endDate;

        prev[0]._id = req.body.sessionId;
        prev[0].backgroundColor = req.body.backgroundColor;

        prev[0].save((err, event) => {
          if (err) res.status(200).json("error: server error");

          res.status(200).json("successfully updated");
        });
      }
    }
  );
});

app.post("/resize",authToken, (req, res) => {
  Calendar.find(
    {
      _id: req.body.sessionId,
    },
    (err, prev) => {
      if (err) {
        console.log(err);
      }

      prev[0].title = req.body.title;
      prev[0].email = req.body.email;
      prev[0].startDate = req.body.startDate;

      prev[0].endDate = req.body.endDate;

      prev[0]._id = req.body.sessionId;
      prev[0].backgroundColor = req.body.backgroundColor;

      prev[0].save((err, event) => {
        if (err) res.status(200).json("error: server error");

        res.status(200).json("successfully updated");
      });
    }
  );
});

app.post("/delete",authToken, (req, res) => {
  Calendar.find(
    {
      email: req.body.email,
    },
    (err, prev) => {
      if (err) {
        res.status(200).json("error:server error");
      }

      Calendar.findOne({ email: req.body.email, _id: req.body.id }, function (
        err,
        model
      ) {
        if (err) {
          return;
        }
        model.remove(function (err) {
          // if no error, your model is removed
          res.status(200).json("Event removed successfully");
        });
      });
    }
  ).catch((err) => console.log(err));
});

app.post("/logout",authToken, (req, res) => {
  res.status(200).json("unsuccess");
});


io.on("connection", (socket) => {
  //console.log("connection established for websocket channel ");
  socket.on("join", ({ email, name }, callback) => {
    console.log(email," joined!!");
    //if(email)
    //socket.emit('message',{email:email,text:`hey ${name} welcome to the page`});
    //socket.broadcart.to(email).emit('message','')
    socket.join(email);
    //callback();
    connectedUsers[email] = socket;

    //if(!(email in connectedUserCredentials))
    connectedUserCredentials[email]={online:1,date:Date.now()};
  });

  socket.on("logout", ({ email }, callback) => {
    connectedUserCredentials[email]={online:0,date:Date.now()};
  });
  //socket.broadcast('online',{status:connectedUserCredentials});
  setInterval(() => {
    io.emit('online', {status:connectedUserCredentials});
  }, 60000);

  //console.log("connectedUsers:",connectedUserCredentials);
  socket.on(
    "sendMessage",
    (
      { email, message, userName, emailCredentials, userNameCredentials },
      callback
    ) => {
      console.log("socket.on sendmessage: ",message,emailCredentials,email);
      console.log("connectedUser: ",connectedUsers[email]);
      io.sockets.in(email).emit("recieveMessage", {
      //connectedUsers[email].emit("recieveMessage", {
        emailCredentials,
        email,
        message,
      });
      console.log("message:",message);
      Chat.find(
        {
          $or: [
            { toEmail: email, fromEmail: emailCredentials },
            { toEmail: emailCredentials, fromEmail: email },
          ],
        },
        (err, previous) => {
          if (previous.length === 0) {
            const newUser = new Chat();
            newUser.fromEmail = emailCredentials;
            newUser.toEmail = email;
            newUser.message = { email, emailCredentials, message };
            newUser.timeStamp = new Date();
            newUser.save((err, user) => {});
          } else {
            const messages = [
              ...previous[0].message,
              { email, emailCredentials, message, timeStamp: new Date() },
            ];
            previous[0].message = messages;
            previous[0].save((err, data) => {});
            // console.log(previous[0])
          }
        }
      );
      socket.emit("message", { user: email, text: message });

      callback();
    }
  );

  // socket.on('disconnect',()=>{
  //     console.log('user had left!!')
  // })
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("smart_goals/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "smart_goals", "build", "index.html"));
  });
}
const oneHour = 3600000;
app.use(express.static("www", { maxAge: oneHour }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.disable("etag");


server.listen(port, "0.0.0.0", () =>
  console.log(`server is running on port ${port}`)
);

}

startServer().catch(console.error);
