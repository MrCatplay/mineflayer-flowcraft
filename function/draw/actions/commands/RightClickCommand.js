const { BaseCommand } = require('./BaseCommand');

class RightClickCommand extends BaseCommand {
  constructor() { super({ name: 'пкм' }); }

  match(t) { return t === 'пкм'; }
  
  async execute(bot) { bot.activateItem(); }
}

module.exports = { RightClickCommand }; 