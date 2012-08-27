/// <reference path="Game.js" />
/// <reference path="PositionModifier.js" />

function Helpers() {
    Helpers.prototype = this;
    return this;
};

Helpers.prototype.RoundNumber = function(number, decimalPlaces) {
    var result = Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    return result;
}