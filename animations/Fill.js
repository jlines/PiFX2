/**
 * Fill simply wipes the entire strand with a specific color
 */
function Fill(){
	this.name = "Color Fill"

	this.config = {
		color: {
			type: 'color',
			value: {
				r: 0,
				g: 255,
				b: 0
			}
		}
	}


    this.frame = 0;
    this.duration = -1;
    this.complete = false;
}


/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Fill.prototype.requestFrame = function(frame, pixelBuffer){
	pixelBuffer.fillRGB(this.config.color.value.g,
								this.config.color.value.r,
								this.config.color.value.b)


	return pixelBuffer
}

module.exports = Fill