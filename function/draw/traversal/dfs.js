function dfs(startNodeId, graph, visit) {
  const visited = new Set();

  function walk(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const neighbours = graph.get(nodeId) || [];
    for (const next of neighbours) {
      visit(next);
      walk(next);
    }
  }

  walk(startNodeId);
}

module.exports = { dfs }; 