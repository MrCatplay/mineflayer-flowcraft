const { BaseCommand } = require('./BaseCommand');

class ShutDownCommand extends BaseCommand {
  constructor() {
    super({ name: 'выключить', description: 'Отключает бота', usage: 'выключить' });
  }

  match(t) { return t === 'выключить'; }
  
  async execute(bot) { await bot.quit(); }
}

module.exports = { ShutDownCommand }; 