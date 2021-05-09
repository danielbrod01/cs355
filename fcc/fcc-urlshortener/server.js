require('dotenv').config();
var express = require('express');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

var isValidURL = (string) => {
  var url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var linkSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
})

var Link = mongoose.model('Link', linkSchema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ 
    greeting: 'hello API'
  });
});

// url shorten endpoint
app.post('/api/shorturl', async (req, res) => {
  var { url } = req.body;
  var link = await Link.findOne({ original_url: url });
  
  //check for a such valid URL
  if (!isValidURL(url)) {
    res.json({
      error: 'invalid URL',
    });
  }
  if (link) {
    res.json({ original_url: link.original_url, 
    short_url: link.short_url 
    });
  } 
  else {
    var newLink = new Link({ 
      original_url: url, 
      short_url: parseInt(Math.floor(100000 + Math.random() * 900000))
    });

    await newLink.save();

    res.json({ 
      original_url: newLink.original_url, 
      short_url: newLink.short_url });
  }
});

app.get('/api/shorturl/:url', async (req, res) => {
  var url = req.params.url;

  var link = await Link.findOne({ 
    short_url: url 
  });

  if (link) {
    res.redirect(link.original_url);
  }

  else {
    res.json({ 
      "error": "No URL found!" 
    })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
