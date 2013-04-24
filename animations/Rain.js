var tinycolor	= require('tinycolor2')

/**
 * Fill simply wipes the entire strand with a specific color
 */
function Rain(){
    this.name = "Color Rain"

    this.config = {
        color: {
            type: 'color',
            value: {
                r: 0,
                g: 0,
                b: 120
            }
        },
        speed: {
            name: 'Speed',
            type: 'range',
            value: 2,
            min: 2,
            max: 25,
            step: 1
        },
        length: {
            name: 'Length',
            type: 'range',
            value: 9,
            min: 3,
            max: 10,
            step: 1
        }
    }
}


/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Rain.prototype.requestFrame = function(frame, pixelBuffer){
    var plength = pixelBuffer.pixelCount;
    var length = this.config.length.value-1

    pixelBuffer.clear();

    for(i=1; i<length; i++) {
        var cp = (i+frame+plength)%plength;
        var r = 0;
        var newcolor = tinycolor.darken({
            r:this.config.color.value.r,
            g:this.config.color.value.g,
            b:this.config.color.value.b
        }, length-i*(50/length)).toRgb();

        //console.log(typeof this.config.color);
        //console.log(newcolor.r);
        pixelBuffer.setColor(cp,newcolor);
    }




    return pixelBuffer
}

module.exports = Rain