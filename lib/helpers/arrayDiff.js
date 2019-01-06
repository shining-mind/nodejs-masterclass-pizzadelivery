/**
 * @param {Array} compared
 * @param {Array} original
 */
module.exports = function arrayDiff(compared, original) {
    return compared.filter(i => original.indexOf(i) === -1);
};
