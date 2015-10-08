'use strict';

var request = require('request');

var Uptime = function () {};

Uptime.prototype.getStatus = function (callback) {
  var options = {
    uri: 'https://api.uptimerobot.com/getMonitors',
    qs: {
      apiKey: process.env.UPTIME_ROBOT_KEY,
      format: 'json',
      noJsonCallback: 1
    }
  };

  request(options, function (err, response, body) {
    if (err) { return callback(err); }

    if (response.statusCode === 200 && body) {
      var data = JSON.parse(body);
      callback(null, data);
    }
  });
};

module.exports = Uptime;
