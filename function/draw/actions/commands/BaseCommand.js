class BaseCommand {
  constructor(options = {}) {
    const {
      name,
      aliases = [],
      description = '',
      usage = '',
      cooldownMs = 0,
    } = options;
    if (!name) throw new Error('Command must have a name');
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
    this.cooldownMs = cooldownMs;
  }

  // Should return boolean
  match(_text) {
    throw new Error('match(text) must be implemented in derived class');
  }

  // Should return args object; default no args
  parse(_text) {
    return {};
  }

  // Should be async
  async execute(_bot, _args) {
    throw new Error('execute(bot, args) must be implemented in derived class');
  }
}

module.exports = { BaseCommand }; 