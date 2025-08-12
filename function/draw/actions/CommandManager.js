const { setFlag } = require('../variables');
const { EditVariableValue } = require('../../state/EditVariable');
const { setCooldown, isCooldownExpired } = require('../variables');

class CommandManager {
  constructor() {
    this.commandNameToDef = new Map();
    this.matchers = [];
  }

  registerCommand(definition) {
    const {
      name,
      aliases = [],
      description = '',
      usage = '',
      cooldownMs = 0,
      match, 
      parse = (text) => ({}),
      handler,
    } = definition;

    if (!name || typeof handler !== 'function' || typeof match !== 'function') {
      throw new Error('Invalid command definition');
    }

    const allNames = [name, ...aliases];
    for (const n of allNames) {
      if (this.commandNameToDef.has(n)) {
        throw new Error(`Command already registered: ${n}`);
      }
      this.commandNameToDef.set(n, definition);
    }

    this.matchers.push({ name, match, parse, cooldownMs, handler, usage, description });
  }

  registerInstance(instance) {
    const name = instance.name;
    const aliases = instance.aliases || [];
    const description = instance.description || '';
    const usage = instance.usage || '';
    const cooldownMs = instance.cooldownMs || 0;
    this.registerCommand({
      name,
      aliases,
      description,
      usage,
      cooldownMs,
      match: (t) => instance.match(t),
      parse: (t) => instance.parse(t),
      handler: async (bot, args) => instance.execute(bot, args),
    });
  }

  replaceVariables(str, bot) {
    if (!str || !bot.variable || !Array.isArray(bot.variable)) return str;
    let result = str;
    for (const v of bot.variable) {
      const varName = v[1];
      const varValue = v[2];
      result = result.replace(new RegExp(`{${varName}}`, 'g'), varValue);
    }
    return result;
  }

  find(text) {
    for (const def of this.matchers) {
      if (def.match(text)) {
        return def;
      }
    }
    return null;
  }

  async execute(bot, rawText) {
    if (!rawText) return;
    const text = rawText.trim().normalize().toLowerCase();

    const def = this.find(text);
    if (!def) {
      const message = this.replaceVariables(text, bot);
      bot.chat(message);
      return;
    }

    if (def.cooldownMs && def.cooldownMs > 0) {
      const key = `cmd:${def.name}`;
      if (!isCooldownExpired(key)) return;
      setCooldown(key, def.cooldownMs);
    }

    const args = def.parse(text);
    await def.handler(bot, args);
  }
}

const commandManager = new CommandManager();

function parseIntSafe(value, fallback = null) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

function getVariableValue(bot, variableName) {
  if (!bot.variable || !Array.isArray(bot.variable)) return null;
  const found = bot.variable.find(v => v[1] === variableName);
  return found ? parseFloat(found[2]) : null;
}

module.exports = { commandManager, parseIntSafe, getVariableValue } 