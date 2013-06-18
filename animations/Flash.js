var tinycolor = require('tinycolor2')

/**
 * Throbs a color
 */
function Flash(){
	this.name = "Flash"

    this.config = {
        color: {
            type: 'color',
            value: {
                r: 255,
                g: 255,
                b: 255
            }
        },
        speed: {
            name: 'Speed',
            type: 'range',
            value: 2,
            min: 1,
            max: 25,
            step: 1
        }
    }

    this.duration = -1;
    this.frame = 1;
    this.complete = false;
}

/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Flash.prototype.requestFrame = function(frame, pixelBuffer){
    if(this.complete) {
        return;
    }
    var leds = pixelBuffer.pixelCount;

    var color = tinycolor({
        r:this.config.color.value.r,
        g:this.config.color.value.g,
        b:this.config.color.value.b
    });

    var speed = this.config.speed.value;


    //pixelBuffer.clear();

    if(((this.frame+speed) % speed) == 0) {
        pixelBuffer.setColor(Math.floor(Math.random()*leds), color.toRgb());
    }

    this.frame++;
    if(this.duration != -1 & this.frame > this.duration) {
        this.complete = true;
    }
}

module.exports = Flash