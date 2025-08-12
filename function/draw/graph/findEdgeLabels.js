const { findElementById } = require('./findElementById');

function findEdgeLabels(parsedData, idMap) {
    const edgeLabels = [];
    const visited = new Set();
    const MAX_DEPTH = 1000;
    function search(obj, depth = 0) {
        if (!obj || typeof obj !== 'object' || depth > MAX_DEPTH) return;
        if (visited.has(obj)) return;
        visited.add(obj);
        if (obj['@_edge'] === '1') {
            const edgeId = obj['@_id'];
            const parent = findElementById(idMap, '1');
            if (parent && parent.mxCell) {
                const cells = Array.isArray(parent.mxCell) ? parent.mxCell : [parent.mxCell];
                for (const cell of cells) {
                    if (cell['@_parent'] === edgeId && (cell['@_value'] === 'ДА' || cell['@_value'] === 'НЕТ')) {
                        edgeLabels.push({
                            edgeId: edgeId,
                            label: cell['@_value']
                        });
                        break;
                    }
                }
            }
        }
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                search(obj[key], depth + 1);
            }
        }
    }
    search(parsedData, 0);
    return edgeLabels;
}

module.exports = { findEdgeLabels } 