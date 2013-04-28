var color = require('tinycolor2')

/**
 * Rotates a color through the color wheel
 */
function Gradient(){
    this.name = "Gradient"

    this.config = {
        color1: {
            type: 'color',
            value: {
                r: 255,
                g: 233,
                b: 61
            }
        },
        color2: {
            type: 'color',
            value: {
                r: 0,
                g: 16,
                b: 94
            }
        },
        speed: {
            name: 'Speed',
            type: 'range',
            value: 300,
            min: 10,
            max: 400
        }
    }
}



/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Gradient.prototype.requestFrame = function(frame, pixelBuffer){
    var steps = this.config.speed.value;
    var i = (frame+steps)%steps;
    var pixels = pixelBuffer.pixelCount

    console.log(steps)
    var c = CreateGradientHSL(this.config.color1.value, this.config.color2.value, steps, i);
    pixelBuffer.fillColor(c);

    return pixelBuffer
}

module.exports = Gradient

function CreateGradientRGB(Color1, Color2, steps, i) {
    var r1,g1,b1,r2,g2,b2;

    r1 = Color1.r;
    g1 = Color1.g;
    b1 = Color1.b;

    r2 = Color2.r;
    g2 = Color2.g;
    b2 = Color2.b;

    rstep = (r2 - r1)/steps;
    gstep = (g2 - g1)/steps;
    bstep = (b2 - b1)/steps;

    return {r:Math.floor(r1+(i*rstep)),g:Math.floor(g1+(i*gstep)),b:Math.floor(b1+(i*bstep))};
}

function CreateGradientHSV(Color1, Color2, steps, i) {
    var r1,g1,b1,r2,g2,b2;

    Color1 = color(Color1).toHsv();
    Color2 = color(Color2).toHsv();



    r1 = Color1.h;
    g1 = Color1.s;
    b1 = Color1.v;

    r2 = Color2.h;
    g2 = Color2.s;
    b2 = Color2.v;

    rstep = (r2 - r1)/steps;
    gstep = (g2 - g1)/steps;
    bstep = (b2 - b1)/steps;

    return color({h:r1+(i*rstep),s:g1+(i*gstep),v:b1+(i*bstep)}).toRgb();
}

function CreateGradientHSL(Color1, Color2, steps, i) {
    var r1,g1,b1,r2,g2,b2;

    Color1 = color(Color1).toHsl();
    Color2 = color(Color2).toHsl();

    h1 = Color1.h;
    g1 = Color1.s;
    b1 = Color1.l;

    h2 = Color2.h;
    g2 = Color2.s;
    b2 = Color2.l;



    var hstep = 0, hue=0;
    if(true) {

        hstep = (360 - Math.abs(h2 - h1))/steps;

        hue = h1-(i*hstep);

        if(hue < 0) {
            hue = 360 + hue;
        }
        else if(hue > 360) {
            hue = hue - 360;
        }

    }
    else {
        hstep = (h2 - h1)/steps;
        hue = h1+(i*hstep);
    }

    gstep = (g2 - g1)/steps;
    bstep = (b2 - b1)/steps;

    return color({h:hue,s:g1+(i*gstep),l:b1+(i*bstep)}).toRgb();
}
