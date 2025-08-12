const { eventMesseger } = require('../draw');

async function Window(bot) {
  bot.on('windowOpen', () => {
    eventMesseger('Инвентарь открыт', bot);
  });

  bot.on('windowClose', () => {
    eventMesseger('Инвентарь закрыт', bot);
  });
}

module.exports = { Window }; 