var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
  let loggedString = `${req.method} ${req.path} - ${req.ip}`
  console.log(loggedString)
  next();
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
  const mySecret = process.env['MESSAGE_STYLE']
  if (mySecret === "uppercase") {
    res.json({"message": "HELLO JSON"});
  }
  else {
    res.json({"message": "Hello json"});
  }
});

app.get("/now", (req,res,next) => {
  req.time = new Date().toString()
  next()
}, (req,res)=> {
  res.send({"time": req.time})
});

app.get("/:word/echo", (req,res) => {
  res.send({"echo":req.params.word});
});

app.route("/name")
    .get((req,res) => {
      res.send({"name": `${req.query.first} ${req.query.last}`})
    })
    .post((req,res) => {
      res.send({"name": `${req.body.first} ${req.body.last}`})
    });


































 module.exports = app;
