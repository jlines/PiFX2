var color = require('tinycolor2')

/**
 * Rotates a color through the color wheel
 */
function TimeOfDay(){
    this.name = "TimeOfDay"
    this.sunriseTime = null;
    this.sunsetTime = null;

    this.config = {};
    this.currentHue = 0;
    this.currentTime = new Date("May 19, 2013 18:55:00");
}



/**
 * Return the pixel buffer with an animation applied
 * @param  {PixelBuffer} pixelBuffer Pixel Buffer representing the strand of pixels
 * @return {PixelBuffer}             The modified pixel buffer
 */
TimeOfDay.prototype.requestFrame = function(frame, pixelBuffer){
    if(this.sunriseTime == null) {
        return;
    }

    //currentTime = new Date("May 19, 2013 19:42:00");
    var solarPadding = 30*60*1000;
    var offset = 20*60*1000;
    var currentTime = new Date(new Date() + offset);
    var step = 0;

    if((cdiff = Math.abs(currentTime - this.sunriseTime)) < solarPadding) {
        //console.log("within sunrise threshold");
        if(currentTime < this.sunriseTime) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = Math.floor((step/(solarPadding*2)) * 1000);
    }
    else if((cdiff = Math.abs(currentTime - this.sunsetTime)) < solarPadding) {
        //console.log("within sunset threshold");
        if(currentTime < this.sunsetTime) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = 1000 - Math.floor((step/(solarPadding*2)) * 1000);

    }
    else if(this.isDaytime(currentTime)) {
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

TimeOfDay.prototype.isDaytime = function(currentTime) {
    return (currentTime > this.sunriseTime && currentTime < this.sunsetTime);
};

TimeOfDay.prototype.CreateGradientSunlight = function(steps, pos) {
    var h1,s1,l1,h2,s2,l2;

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
    s1 = Color1.s;
    l1 = Color1.l;

    h2 = Color2.h;
    s2 = Color2.s;
    l2 = Color2.l;



    var hstep = 0, hue=0;
    if(true) {

        hstep = ((360-h1)+h2)/steps;
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

    sstep = (s2 - s1)/steps;
    lstep = (l2 - l1)/steps;

    if(hue != this.currentHue) {
        this.currentHue = hue;
        //console.log("Time of day Hue : " + this.currentHue);
    }

    return color({h:hue,s:s1+(pos*sstep),l:l1+(pos*lstep)}).toRgb();
}


module.exports = TimeOfDay

