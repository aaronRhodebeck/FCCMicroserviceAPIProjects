// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
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

// your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Time stamp API endpoint
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

// Request Header Parser API endpoint
var parseHeader = require('./src/RequestHeaderParser');

app.get('/api/whoami', function(req, res) {
  const parsedHeader = parseHeader(req.headers);
  res.json(parsedHeader);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
