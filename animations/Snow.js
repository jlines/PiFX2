var color = require('tinycolor2')
var logger = require('log4js').getLogger();

function Snow(pixelBuffer){
    var self = this;
    this.name = "Color Fill"

    this.config = {

    };

    this.frame = 0;
    this.duration = -1;
    this.complete = false;
    this.pixelBuffer = pixelBuffer;
    this.pixelCount = this.pixelBuffer.pixelCount;
    this.cloudCover = 0;


    this.desaturate = 5;
    this.increment = .03;



    this.pixelArray = [];
    for(i=0;i<this.pixelCount;i++) {
        this.pixelArray[i] = [Math.random()<.5?-1:1,Math.random()];
    }
}

//multiplier range 1:2
Snow.prototype.multiplier = function() {return this.cloudCover;}
//saturation range 0:1
Snow.prototype.maxSaturation = function() {return 1 - this.cloudCover;}

/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Snow.prototype.requestFrame = function(){


    //logger.debug("--------------------")
    for(i = 0; i<this.pixelCount; i++) {
        //this.pixelArray[i][1] -= this.desaturate;
        this.pixelArray[i][1] += (this.increment*this.pixelArray[i][0]);
        if(this.pixelArray[i][1] < 0 || this.pixelArray[i][1] > 1) {
            this.pixelArray[i][0] *= -1;
            this.pixelArray[i][1] += (this.increment*this.pixelArray[i][0]);
        }
        var col = color(this.pixelBuffer.getPixel(i).color).toHsl();

        col.s -= (this.pixelArray[i][1] * this.multiplier());
        if(col.s < 0) {
           col.s = 0;
        }
        if(col.s > this.maxSaturation()) {
            //logger.debug("hit max sat");
            col.s = this.maxSaturation();
        }

        //logger.debug(this.pixelArray[i][1] * this.multiplier);
        //logger.debug(JSON.stringify( col));
        //logger.debug(JSON.stringify(this.pixelArray[i]));
        this.pixelBuffer.setColor(i, color(col).toRgb());
    }


    return this.pixelBuffer;
}

module.exports = Snow
