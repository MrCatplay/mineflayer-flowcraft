const { eventMesseger } = require('../draw');

async function death(bot) {
  bot.on('death', async () => {
    eventMesseger('Бот умер', bot);
  });
}

module.exports = { death }; 