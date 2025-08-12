const { eventMesseger } = require('../draw');

function spawn(bot) {
  // Триггер при логине
  bot.on('login', async () => {
    await eventMesseger('Бот появился', bot);
  });
  // Триггер когда сущность спавнится впервые
  bot.on('spawn', async () => {
    await eventMesseger('Бот появился', bot);
  });
  // Триггер при респавне после смерти
  if (typeof bot.on === 'function') {
    bot.on('respawn', async () => {
      await eventMesseger('Бот появился', bot);
    });
  }
}

module.exports = { spawn }; 