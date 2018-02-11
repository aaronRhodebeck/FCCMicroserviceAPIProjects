// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).catch(err => console.log(err));

// #region Middleware
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded())
// #endregion

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// #region http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/timestamp-microservice', function(req, res) {
  res.sendFile(__dirname + '/views/timestamp-microservice.html');
});
app.get('/request-header-parser-microservice', function(req, res) {
  res.sendFile(__dirname + '/views/request-header-parser-microservice.html');
});
app.get('/url-shortener-microservice', function(req, res) {
  res.sendFile(__dirname + '/views/url-shortener-microservice.html');
});
app.get('/exercise-tracker', function(req, res) {
  res.sendFile(__dirname + '/views/exercise-tracker.html');
});
app.get('/file-metadata-microservice', function(req, res) {
  res.sendFile(__dirname + '/views/file-metadata-microservice.html');
});
// #endregion

// #region your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
// #endregion

// #region Time stamp API endpoint
var parseDate = require('./src/TimeStamp.js').parseDate;
var unixTimeStampFrom = require('./src/TimeStamp.js').unixTimeStampFrom;
var utcTimeStampFrom = require('./src/TimeStamp.js').utcTimeStampFrom;

app.get('/api/timestamp', function(req, res) {
  const date = parseDate('');
  res.json({ unix: unixTimeStampFrom(date), utc: utcTimeStampFrom(date) });
});

app.get('/api/timestamp/:date', function(req, res) {
  console.log(req.params.date);
  const date = parseDate(req.params.date);
  res.json({ unix: unixTimeStampFrom(date), utc: utcTimeStampFrom(date) });
});
// #endregion

// #region Request Header Parser API endpoint
var parseHeader = require('./src/RequestHeaderParser');

app.get('/api/whoami', function(req, res) {
  const parsedHeader = parseHeader(req.headers);
  res.json(parsedHeader);
});
// #endregion

// #region URL Shortener endpoint
const makeModel = require('./src/URLShortener').makeURLShortenerModel;
const shortURLModel = makeModel(mongoose);
const shortenURL = require('./src/URLShortener');
const dns = require('dns');
const getOriginalURL = require('./src/URLShortener').getOriginalURL;
const parseURL = require('./src/URLShortener').parseURL;

app.post('/api/shorturl/new', function(req, res) {
  const requestedURL = parseURL(req.body.newURL)
  const baseURL = 'https://aaron-rhodebeck-freecodecamp-api-projects.glitch.me/api/shorturl';

  dns.lookup(requestedURL, function(err) {
    if (err) {
      res.json({ original_url: requestedURL, shortURL: 'Invalid URL' });
    } else {
      shortenURL(requestedURL, shortURLModel, baseURL).then(function(result) {
        res.json({ original_url: requestedURL, shortURL: result });
      }).catch(function(err) {
        res.json({err: err})
        console.log(err);
      });
    }
  });
});

app.get('/api/shorturl/:num', function(req, res) {
  getOriginalURL(req.params.num, shortURLModel).then(function(result) {
    res.redirect(`https://${result}`)
  }).catch(err => console.log(err));
});

// #endregion

// #region listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
// #endregion
