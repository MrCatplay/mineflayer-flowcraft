const { BaseCommand } = require('./BaseCommand');

class SitCommand extends BaseCommand {
  constructor() { super({ name: 'сесть' }); }
  match(t) { return t === 'сесть'; }
  async execute(bot) { bot.setControlState('sneak', true); }
}

class StandCommand extends BaseCommand {
  constructor() { super({ name: 'встать' }); }

  match(t) { return t === 'встать'; }
  
  async execute(bot) { bot.setControlState('sneak', false); }
}

module.exports = { SitCommand, StandCommand }; 