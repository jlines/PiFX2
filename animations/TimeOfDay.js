var color = require('tinycolor2')

/**
 * Rotates a color through the color wheel
 */
function TimeOfDay(){
    this.name = "TimeOfDay"
    this.weatherTracker = null;

    this.config = {};
}



/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
TimeOfDay.prototype.requestFrame = function(frame, pixelBuffer){
    if(this.weatherTracker.weatherData == null) {
        return;
    }

    var currentTime = new Date();
    var solarPadding = 30*60*1000;
    var step = 0;

    if((cdiff = Math.abs(currentTime - this.weatherTracker.sunRiseTime)) < solarPadding) {
        //console.log("within sunrise threshold");
        if(currentTime < this.weatherTracker.sunRiseTime) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = Math.floor((step/(solarPadding*2)) * 1000);
    }
    else if((cdiff = Math.abs(currentTime - this.weatherTracker.sunSetTime)) < solarPadding) {
        //console.log("within sunset threshold");
        if(currentTime < this.weatherTracker.sunSetTime) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = 1000 - Math.floor((step/(solarPadding*2)) * 1000);

    }
    else if(this.weatherTracker.isDaytime(currentTime)) {
        //console.log("its the daytime");
        step = 1000;
    }
    else {
        //console.log("its the nighttime");
        step = 0;
    }


    //console.log("step : " + step + " / 1000");
    pixelBuffer.fillColor(this.CreateGradientSunlight(1000, step));
}

TimeOfDay.prototype.CreateGradientSunlight = function(steps, pos) {
    var r1,g1,b1,r2,g2,b2;

    var c1 = {
        r: 0,
        g: 16,
        b: 94
    }; //nighttime
    var c2= {
        r: 255,
        g: 233,
        b: 61
    }; //daytime

    Color1 = color(c1).toHsl();
    Color2 = color(c2).toHsl();

    h1 = Color1.h;
    g1 = Color1.s;
    b1 = Color1.l;

    h2 = Color2.h;
    g2 = Color2.s;
    b2 = Color2.l;



    var hstep = 0, hue=0;
    if(true) {

        hstep = (360-h1+h2)/steps;
        //hstep = (360 - Math.abs(h2 - h1))/steps;

        hue = h1+(pos*hstep);

        if(hue < 0) {
            hue = 360 + hue;
        }
        else if(hue > 360) {
            hue = hue - 360;
        }

    }
    else {
        hstep = (h2 - h1)/steps;
        hue = h1+(pos*hstep);
    }

    gstep = (g2 - g1)/steps;
    bstep = (b2 - b1)/steps;

    return color({h:hue,s:g1+(pos*gstep),l:b1+(pos*bstep)}).toRgb();
}


module.exports = TimeOfDay

