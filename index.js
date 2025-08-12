const { eventMesseger, findCloudShapes } = require('./function/draw');
const { registerFlowDefaults } = require('./function/events');

class FlowCraft {
  constructor(bot, options = {}) {
    this.bot = bot;
    this.scriptPath = options.scriptPath || 'script.drawio';
    this.attachToBot();
    registerFlowDefaults(this.bot);
  }

  attachToBot() {
    this.bot.flowcraft = { scriptPath: this.scriptPath };
    const cloudShapes = findCloudShapes(this.scriptPath);
    this.bot.variable = cloudShapes;
  }

  async trigger(eventName) {
    await eventMesseger(eventName, this.bot);
  }

  static loadScript(bot, scriptPath) {
    return new FlowCraft(bot, { scriptPath });
  }
}

module.exports = { FlowCraft, registerFlowDefaults };