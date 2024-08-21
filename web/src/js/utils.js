/**
 * Returns normalized to min-max range value. 
 * @param {number} value - Initial value. 
 * @param {number} minValue - Minimum value in array. 
 * @param {number} maxValue - Maximum value in array. 
 * @param {number} minRange - Minimum target value. 
 * @param {number} maxRange - Maximum target value. 
 * @returns {number} - Normalized to range value. 
 */
function normalizeToRange(value, minValue, maxValue, minRange=-1, maxRange=1) {
    return minRange + ((value - minValue) * (maxRange - minRange)) / (maxValue - minValue);
}

export {normalizeToRange};