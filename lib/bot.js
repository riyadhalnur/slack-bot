'use strict';

var _ = require('lodash');
var util = require('util');
var Bot = require('slackbots');
var Uptime = require('./uptime.js');

var uptime = new Uptime();

var UptimeBot = function (settings) {
  if (!_.isObject(settings)) {
    throw new Error('Expected settings to be an object!');
  }

  this.settings = settings;
  this.user = null;
};

util.inherits(UptimeBot, Bot);

UptimeBot.prototype.run = function () {
  UptimeBot.super_.call(this, this.settings);

  this.on('start', function () {
    console.log('Bot online!');
    this.getBotUser();
  });

  this.on('message', this.onMention);
};

UptimeBot.prototype.onMention = function (message) {
  var self = this;

  var params = {
    icon_emoji: ':unamused:', /* jshint ignore:line */
    as_user: true /* jshint ignore:line */
  };

  if (message.type === 'message' && Boolean(message.text) && _.contains(message.text, this.name) && _.isString(message.channel) && message.channel[0] === 'C' && !this.isBot(message)) {
    return self.sendMessage(message, 'What do you want?', params);
  } else if (message.type === 'message' && Boolean(message.text) && _.contains(message.text, 'status') && _.isString(message.channel) && message.channel[0] === 'C' && !this.isBot(message)) {
    return uptime.getStatus(function (err, data) {
      if (err) { return self.sendMessage(message, 'Ummmm.....server is...idk', params); }

      return self.sendMessage(message, data.monitors.monitor[3].status + ' for ' + data.monitors.monitor[3].friendlyname);
    });
  } else {
    return;
  }
};

UptimeBot.prototype.serverStatus = function (message) {
  console.log('in server status ', message);
};

UptimeBot.prototype.sendMessage = function (originalMessage, message, params) {
  var self = this;

  params = params || { as_user: true };

  var channel = _.filter(this.channels, function (channel) {
    return channel.id === originalMessage.channel;
  })[0];

  self.postMessageToChannel(channel.name, message, params);
};

UptimeBot.prototype.getBotUser = function () {
  var self = this;

  this.user = _.filter(this.users, function (user) {
    return user.name === self.name;
  })[0];
};

UptimeBot.prototype.isBot = function (message) {
  return message.user === this.user.id;
};

module.exports = UptimeBot;
