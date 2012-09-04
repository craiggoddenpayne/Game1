/// <reference path="Game.js" />
/// <reference path="PositionModifier.js" />
/// <reference path="RiffWave.js" />

function Helpers() {
    Helpers.prototype = this;
    return this;
};

Helpers.prototype.RoundNumber = function(number, decimalPlaces) {
    var result = Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    return result;
};

Helpers.prototype.PlayBounce = function () {

    var audio = new Audio(); 
    var wave = new RIFFWAVE(); 
    

    wave.header.sampleRate = 44100; 
    wave.header.numChannels = 2; 

    var frequency = 302;
    var samplesLength = 10000;
    var samples = [];
    for (var i = 0; i < samplesLength; i++) { 
        var t = i / samplesLength;               
        samples[i] = Math.sin(frequency *7  * Math.PI * t); 
    }
    wave.Make(samples); // make the wave file
    audio.src = wave.dataURI; // set audio source
    audio.play(); // we should hear two tones one on each speaker
};

