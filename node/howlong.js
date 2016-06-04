var express = require('express');
var request = require('request');

var port = process.env.PORT || 8080;

var app = express();
app.post('/howlong', function(req, res) {
    console.log('request message body', req);
    sendMessage(res);
});

var sendMessage = function(res) {
    var time = getTimeRemaining("2016-06-11 19:00:00");
    console.log(time);
    var message = "Olutristeily countdown: " + time.days + "d " + time.hours + "h " + time.minutes + "m " + time.seconds + "s";
    var options = { method: 'POST',
      url: 'https://api.telegram.org/bot162620888:AAEVQ8nB9mFbZmqdJW7FDtLiz1Td83FeYGY/sendMessage',
      headers:
       { 'content-type': 'application/json' },
      body: { chat_id: '-6480162', text: message},
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
    res.status(200).send();
}

function daydiff(first, second) {
    console.log('daydiff', first, second);
    return Math.floor((second-first)/(60*60*24));
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


app.listen(port);
console.log('Magic happens on port ' + port);
