'use strict';

var Bot = require('./lib/bot.js');

var bot = new Bot({
  token: process.env.SLACKBOT_KEY,
  name: process.env.SLACKBOT_NAME
});

bot.run();
