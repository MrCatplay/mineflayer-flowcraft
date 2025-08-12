const { BaseCommand } = require('./BaseCommand');
const { setFlag } = require('../../variables');

class CloseInventoryCommand extends BaseCommand {
  constructor() { super({ name: 'закрыть инвентарь' }); }

  match(t) { return t === 'закрыть инвентарь'; }
  
  async execute(bot) {
    if (bot.currentWindow) {
      bot.closeWindow(bot.currentWindow);
      setFlag('inventoryOpen', false);
    }
  }
}

module.exports = { CloseInventoryCommand }; 