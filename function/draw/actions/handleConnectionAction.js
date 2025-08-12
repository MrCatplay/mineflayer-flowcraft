const IGNORED_EVENTS = new Set(['бот умер', 'чат', 'бот появился']);
const { commandManager } = require('./CommandManager');
const { registerDefaultCommands } = require('./registerDefaultCommands');

let defaultsRegistered = false;
function ensureDefaults() {
  if (!defaultsRegistered) {
    registerDefaultCommands();
    defaultsRegistered = true;
  }
}

async function handleConnectionAction(bot, action) {
  if (!action) return;
  ensureDefaults();

  try {
    const normalizedAction = action.trim().normalize();
    const command = normalizedAction.toLowerCase();

    if (IGNORED_EVENTS.has(command)) return;

    if (command.startsWith('кд: ')) {
      const delay = parseInt(command.split('кд: ')[1], 10);
      if (!isNaN(delay)) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      return;
    }

    await commandManager.execute(bot, command);
  } catch (error) {
    console.error(`Error handling action: ${action}`, error);
  }
}

module.exports = { handleConnectionAction } 