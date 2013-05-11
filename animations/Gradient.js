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
            min: 100,
            max: 50000
        }
    }

    this.frame = 0;
    this.duration = -1;
    this.complete = false;
    this.rgb = false;
    this.color3 = null;
}



/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
Gradient.prototype.requestFrame = function(f, pixelBuffer){
    this.frame++;
    var steps = Number(this.config.speed.value);
    var position = (this.frame+steps)%steps;
    var pixels = pixelBuffer.pixelCount

    //console.log(this.frame +" + "+steps+" % "+steps+"="+position);

    //console.log(steps)
    var c = null;
    if(this.rgb == true) {
        if(this.color3 == null | position < steps/2) {
            c = this.CreateGradientRGB(this.config.color1.value, this.config.color2.value, steps, position);


        }
        else {
            c = this.CreateGradientRGB(this.config.color2.value, this.color3, steps, position-steps/2);

        }


    }
    else {

        if(this.color3 == null | position < steps/2) {
            c = this.CreateGradientHSL(this.config.color1.value, this.config.color2.value, steps, position);

        }
        else {
            c = this.CreateGradientHSL(this.config.color2.value, this.color3, steps, position-steps/2);
        }

    }


    pixelBuffer.fillColor(c);


    if(this.duration > 0 && this.frame > this.duration) {
        this.complete = true;
    }

    return pixelBuffer
}

module.exports = Gradient

Gradient.prototype.CreateGradientRGB = function(Color1, Color2, steps, fr) {
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


    /*console.log("start")
    console.log(Color1)
    console.log(Color2)
    console.log(steps)
    console.log("in grad " + fr)*/

    var col = {r:Math.floor(r1+(fr*rstep)),g:Math.floor(g1+(fr*gstep)),b:Math.floor(b1+(fr*bstep))};
    console.log(col)

    return col;
}

Gradient.prototype.CreateGradientHSV = function(Color1, Color2, steps, i) {
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

Gradient.prototype.CreateGradientHSL = function(Color1, Color2, steps, pos) {
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

        hue = h1-(pos*hstep);

        if(hue < 0) {
            hue = 360 + hue;
        }
        else if(hue > 360) {
            hue = hue - 360;
        }
        console.log(hue);
    }
    else {
        hstep = (h2 - h1)/steps;
        hue = h1+(pos*hstep);
    }

    gstep = (g2 - g1)/steps;
    bstep = (b2 - b1)/steps;

    return color({h:hue,s:g1+(pos*gstep),l:b1+(pos*bstep)}).toRgb();
}

