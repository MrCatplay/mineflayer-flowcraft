const { eventMesseger } = require('../draw');

async function end(bot) {
  bot.on('end', () => {
    eventMesseger('Бот выключен', bot);
  });
}

module.exports = { end }; 