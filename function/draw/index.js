module.exports = {
  // parsing
  ...require('./parsing/searchInDrawioFile'),
  // graph
  ...require('./graph/buildIdIndex'),
  ...require('./graph/findElementById'),
  ...require('./graph/findEdgeLabels'),
  ...require('./graph/findConnections'),
  ...require('./graph/findConnectionChain'),
  ...require('./graph/buildGraphIndex'),
  // actions
  ...require('./actions/handleConnectionAction'),
  ...require('./actions/CommandManager'),
  ...require('./actions/registerDefaultCommands'),
  // state
  ...require('./variables'),
  ...require('./state/store'),
  // traversal
  ...require('./traversal/dfs'),
  // events
  ...require('./event/eventMessager'),
}; 