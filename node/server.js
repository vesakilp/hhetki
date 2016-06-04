// server.js

// BASE SETUP
// ==============================================

require('es6-promise').polyfill();
var express = require('express');
var bodyParser = require('body-parser');
var uuid64 = require('uuid64');
// var request = require('request');
var axios = require('axios');
var app = express();
var port = process.env.PORT || 8080;

var giphyApiKey = 'dc6zaTOxFJmzC';
var botApiKey = '214343648:AAEKHOC2AnxDPg7OW_vEBtb2mY4HGxNKw6k';
var giphyRandomApiUrl = 'http://api.giphy.com/v1/gifs/random';
var originalSearchTerm;
var chatId;

app.use(bodyParser.json());
// route with parameters (http://localhost:8080/token/:searchTerm)
app.post('/token', function(req, res) {
    console.log('request message body', req.body);
    if(req.body && req.body.message && req.body.message.text) {
        text = req.body.message.text;
        originalSearchTerm = text.substr(text.indexOf("@gifrBot") + "@gifrBot".length).trim();
        chatId = req.body.message.chat.chatId;
        makeGiffyApiCall(originalSearchTerm, res);
    }
    else {
        var responseJson = constructResponseJson({image_url: 'Could not find gif for keyword: ' + originalSearchTerm});
        sendMessage(responseJson);
        res.status(404).send();
    }
});

function makeGiffyApiCall(searchTerm, res) {
    console.log('createGiffyApiCall', searchTerm);
    searchTerm = recastSearchTerm(searchTerm);
    console.log('make giphy api call with search term: ' + searchTerm);
    axios.get(giphyRandomApiUrl + '?api_key=' + giphyApiKey + '&tag' + searchTerm + '&fmt')
      .then(function (response) {
          console.log('response1', response.data.data);
          if(response.data.data && response.data.data.image_url) {
              if(response.data.data.type !== 'gif') {
                  makeGiffyApiCall(searchTerm, res);
              }
              var responseJson = constructResponseJson(response.data.data);
              console.log('responseJson', responseJson);
              sendMessage(responseJson);
              res.status(200).send();
              //TODO kutsutaan sendMessagea
            //   res.setHeader('Content-Type', 'application/json');
            //   console.log('send json');
            //   res.json(responseJson);
            //   console.log('response sent');
          } else {
              res.status(501).send('error in giphy api');
          }
      })
      .catch(function (error) {
          console.log('response catch', error);
          res.status(501).send(error);
      });
    //http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=american+psycho
}

function sendMessage(responseJson) {
    var methodUrl = 'https://api.telegram.org/bot' + botApiKey + '/sendMessage';
    var options = {
      uri: methodUrl,
      method: 'POST',
      json: responseJson
    };
    // request(options, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body.id) // Print the shortened url.
    // } else {
    //     console.log('error sending message', error);
    // }
});
}

function recastSearchTerm(searchTerm) {
    return searchTerm.split(' ').join('+');
}

function constructResponseJson(response) {
    // var responseJson = {
    //     inline_query_id: uuid64(),
    //     results: [{
    //         type: 'gif',
    //         id: uuid64(),
    //         gif_url: response.image_url,
    //         thumb_url: response.fixed_width_small_still_url,
    //         caption: originalSearchTerm
    //     }]
    // }

    var responseJson = {
        chat_id: chatId,
        text: response.image_url
    }
    console.log('constructResponseJson', responseJson);
    return responseJson;
}

// apply the routes to our application
//app.use('/', router);

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
