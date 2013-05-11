var color = require('tinycolor2')

/**
 * Rotates a color through the color wheel
 */
function Sunshine(){
    this.name = "Sunshine"

    this.config = {
        speed: {
            name: 'Speed',
            type: 'range',
            value: 10,
            min: 0,
            max: 100
        },
        noise: {
            name: 'Noise',
            type: 'range',
            value: 2,
            min: 0,
            max: 100,
            step:1
        }
    }
}



/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Sunshine.prototype.requestFrame = function(frame, pixelBuffer){
    var PI = 3.14159265;
    var pixels = pixelBuffer.pixelCount;
    var cycles = 4;
    var col = pixelBuffer.getPixel(1).color;
    var y = 0;
    var r1= 0,g1= 0,b1=0;
    var fade = this.config.noise.value;

    var a = 1;
    var b = .7;
    var c = frame/this.config.speed.value;
    var d = 0;
    //console.log(frame);
    for(i=0; i<pixels; i++) {
        y = a*Math.sin(b*i + c)+d;
        //console.log("speed" +b +" phase"+ c  + " y" + y)

        if(y >= 0.0) {
            //Peaks of sine wave are white
            //y = 1.0 - y; //Translate Y to 0.0 (top) to 1.0 (center)
            r1 = col.r + (y*fade);
            g1 = col.g + (y*fade);
            b1 = col.b + (y*fade);
        }
        else {
            //Troughs of sine wave are black
            //y += 1.0 //#Translate Y to 0.0 (bottom) to 1.0 (center)
            r1 = col.r - (y*fade);
            g1 = col.g - (y*fade);
            b1 = col.b - (y*fade);
        }

        //console.log(c2.toRgbString())
        pixelBuffer.setColor(i, color({r:r1, g:g1, b:b1}).toRgb())
    }

    return pixelBuffer
}

module.exports = Sunshine

