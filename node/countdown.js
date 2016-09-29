var request = require("request");
var schedule = require('node-schedule');

var sendMessage = function() {
    var time = getTimeRemaining("2016-10-21 17:00:00");
    console.log(time);
    var message = time !== null ? "Stockholm craft cruise: " + time.days + "d " + time.hours + "h " + time.minutes + "m " + time.seconds + "s" : "Bottoms up!";
    console.log(message);
    //var message = "Olutristeily countdown: Risteily peruttu tennisottelun johdosta. Lisätiedustelut Heikki Wilen, +358 40 7763100";
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
}

function daydiff(first, second) {
    console.log('daydiff', first, second);
    return Math.floor((second-first)/(60*60*24));
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  if(t < 0) return null;
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

var j = schedule.scheduleJob('*/5 * * * *', function(){
  console.log('Send message call');
  sendMessage();
});
