const mineflayer = require('mineflayer');
const { FlowCraft } = require('./index');

// Создаём оффлайн-бота (без подключения к серверу)
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'FlowBot',
  version: '1.19.2'
});

// Подключаем FlowCraft
new FlowCraft(bot, { scriptPath: 'script.drawio' });
