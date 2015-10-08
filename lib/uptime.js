'use strict';

var _ = require('lodash');
var util = require('util');
var request = require('request');
var EventEmitter  = require('events').EventEmitter;

var Uptime = function () {};

util.inherits(Uptime, EventEmitter);

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
    if (err) {
      if (callback && _.isFunction(callback)) {
        callback(err);
      }

      return this.emit('error', err);
    }

    if (response.statusCode === 200 && body) {
      var data = JSON.parse(body);

      if (callback && _.isFunction(callback)) {
        callback(null, data);
      }

      return this.emit('response', data);
    }
  });
};

module.exports = Uptime;
