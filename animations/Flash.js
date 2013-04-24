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
            min: 2,
            max: 25,
            step: 1
        }
    }
}

/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Flash.prototype.requestFrame = function(frame, pixelBuffer){
    var leds = pixelBuffer.pixelCount;

    var color = tinycolor({
        r:this.config.color.value.r,
        g:this.config.color.value.g,
        b:this.config.color.value.b
    });

    var speed = this.config.speed.value;

    pixelBuffer.clear();

    if(((frame+speed) % speed) == 0) {
        pixelBuffer.setColor(Math.floor(Math.random()*leds), color.toRgb());
    }

	return pixelBuffer
}

module.exports = Flash