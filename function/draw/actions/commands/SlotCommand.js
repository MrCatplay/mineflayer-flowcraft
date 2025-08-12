const { BaseCommand } = require('./BaseCommand');
const { parseIntSafe } = require('../CommandManager');

class SlotCommand extends BaseCommand {
  constructor() { super({ name: 'слот', usage: 'слот: <number>' }); }

  match(t) { return t.startsWith('слот: '); }

  parse(t) { return { slot: parseIntSafe(t.replace('слот: ', ''), -1) }; }
  
  async execute(bot, { slot }) {
    if (Number.isInteger(slot) && slot >= 0) {
      bot.clickWindow(slot, 0, 0);
    }
  }
}

module.exports = { SlotCommand }; 