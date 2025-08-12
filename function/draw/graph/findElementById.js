function findElementById(idMap, id) {
    return idMap.get(id) || null;
}

module.exports = { findElementById } 