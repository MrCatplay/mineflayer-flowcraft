const { commandManager } = require('./CommandManager');
const { ShutDownCommand } = require('./commands/ShutDownCommand');
const { SitCommand, StandCommand } = require('./commands/SitStandCommand');
const { RightClickCommand } = require('./commands/RightClickCommand');
const { CloseInventoryCommand } = require('./commands/CloseInventoryCommand');
const { HotbarCommand } = require('./commands/HotbarCommand');
const { SlotCommand } = require('./commands/SlotCommand');
const { VarSetCommand } = require('./commands/VarSetCommand');
const { VarAddCommand } = require('./commands/VarAddCommand');
const { VarSubCommand } = require('./commands/VarSubCommand');
const { VarMulCommand } = require('./commands/VarMulCommand');
const { VarDivCommand } = require('./commands/VarDivCommand');

function registerDefaultCommands() {
  commandManager.registerInstance(new ShutDownCommand());
  commandManager.registerInstance(new SitCommand());
  commandManager.registerInstance(new StandCommand());
  commandManager.registerInstance(new RightClickCommand());
  commandManager.registerInstance(new CloseInventoryCommand());
  commandManager.registerInstance(new HotbarCommand());
  commandManager.registerInstance(new SlotCommand());
  commandManager.registerInstance(new VarSetCommand());
  commandManager.registerInstance(new VarAddCommand());
  commandManager.registerInstance(new VarSubCommand());
  commandManager.registerInstance(new VarMulCommand());
  commandManager.registerInstance(new VarDivCommand());
}

module.exports = { registerDefaultCommands }; 