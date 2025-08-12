const { eventMesseger } = require('../draw');

function spawn(bot) {
  // Триггер события появления (login)
  bot.on('login', async () => {
    await eventMesseger('Бот появился', bot);
  });
}

module.exports = { spawn }; 