function buildIdIndex(parsedData) {
    const idMap = new Map();
    function traverse(node) {
        if (node && typeof node === 'object') {
            if (node['@_id']) {
                idMap.set(node['@_id'], node);
            }
            for (const key in node) {
                if (typeof node[key] === 'object') {
                    traverse(node[key]);
                }
            }
        }
    }
    traverse(parsedData);
    return idMap;
}

module.exports = { buildIdIndex } 