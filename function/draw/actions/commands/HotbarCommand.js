const { BaseCommand } = require('./BaseCommand');
const { parseIntSafe } = require('../CommandManager');

class HotbarCommand extends BaseCommand {
  constructor() { super({ name: 'хотбар', usage: 'хотбар: 0..8' }); }

  match(t) { return t.startsWith('хотбар: '); }

  parse(t) { return { slot: parseIntSafe(t.replace('хотбар: ', ''), -1) }; }
  
  async execute(bot, { slot }) {
    if (Number.isInteger(slot) && slot >= 0 && slot < 9) {
      bot.setQuickBarSlot(slot);
    }
  }
}

module.exports = { HotbarCommand }; 