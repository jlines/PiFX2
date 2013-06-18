var color = require('tinycolor2')

/**
 * Rotates a color through the color wheel
 */
function SineWave(){
    this.name = "SineWave"

    this.config = {
        speed: {
            name: 'Speed',
            type: 'range',
            value: 1,
            min: 1,
            max: 99
        },
        noise: {
            name: 'Noise',
            type: 'range',
            value: 50,
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
SineWave.prototype.requestFrame = function(frame, pixelBuffer){
    var pixels = pixelBuffer.pixelCount;
    var cycles = 4;
    var col = pixelBuffer.getPixel(1).color;
    //col = {r:255,g:20,b:180};
    var y = 0;
    var r1= 0,g1= 0,b1=0;
    var fade = this.config.noise.value;

    var a = 1;
    var b = .7;

    if(this.config.speed.value > 99) {
        this.config.speed.value = 99;
    }

    var c = frame/(100-this.config.speed.value);
    var d = 0;

    for(i=0; i<pixels; i++) {
        y = a*Math.sin(b*i + c)+d;
        //console.log("speed" +b +" phase"+ c  + " y" + y)

        r1 = col.r + (y*fade);
        g1 = col.g + (y*fade);
        b1 = col.b + (y*fade);

        //console.log(c2.toRgbString())
        pixelBuffer.setColor(i, color({r:r1, g:g1, b:b1}).toRgb())
        //console.log(color({r:r1, g:g1, b:b1}).toRgbString());
    }
    //console.log(pixelBuffer)

    return pixelBuffer
}

module.exports = SineWave