var https = require('https');
var grad = new (require('./animations/Gradient'));

function WeatherTracker() {
    this.weatherData = null;
    this.trackWeather = true;
    this.animations = null;
    this.livePixels = null;
    this.onStart();

    this.ctime = new Date();
    this.ctime.setHours(19);
    this.ctime.setMinutes(2);
}

WeatherTracker.prototype.onStart = function() {
    this.updateWeatherData();
}

WeatherTracker.prototype.setAnimationList = function(animations) {
    this.animations = animations;

    //this.doFlash();
}

WeatherTracker.prototype.setPixels = function(pixels) {
    this.pixels = pixels;
}

WeatherTracker.prototype.doFlash = function() {
    var self = this;

    grad2 = new (require('./animations/Gradient'));
    grad2.config.speed.value = 12;
    grad2.config.color1.value = this.pixels.getPixel(1).color;
    grad2.config.color2.value = {r:0,g:255,b:0};
    //grad2.color3 = this.pixels.getPixel(1).color;
    grad2.duration = 12;
    grad2.rgb = true;



    this.animations.push(grad2);
    console.log("Pushing flash anim");
    console.log(grad2.config.color1.value);
    console.log(grad2.config.color2.value);

    setTimeout(function() {self.doFlash();}, 15000);

};

WeatherTracker.prototype.updateWeatherData = function() {
    var self = this;
    var options = {
        host: 'api.forecast.io',
        path: '/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/33.504213,-111.911083'
    };

    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            var data = JSON.parse(str);
            self.weatherData = data;
            if(self.trackWeather) {
                setTimeout(function() {self.updateWeatherData();}, 3600 * 1000);
            }
        });
    }

    console.log("Request weather data");

    https.request(options, callback).end();
};

WeatherTracker.prototype.setBackgroundFrame = function() {
    if(this.weatherData == null) {
        return;

    }



    var currentTime = new Date();
    var sunRise = new Date(this.weatherData.daily.data[0].sunriseTime * 1000);

    var sunSet = new Date(this.weatherData.daily.data[0].sunsetTime * 1000);

    var solarPadding = 30*60*1000;
    var step = 0;

    if((cdiff = Math.abs(currentTime - sunRise)) < solarPadding) {
        //console.log("within sunrise threshold");
        if(currentTime < sunRise) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = Math.floor((step/(solarPadding*2)) * 1000);
    }
    else if((cdiff = Math.abs(currentTime - sunSet)) < solarPadding) {
        //console.log("within sunset threshold");
        if(currentTime < sunSet) {
            step = solarPadding - cdiff;
        }
        else {
            step = solarPadding + cdiff;
        }
        step = 1000 - Math.floor((step/(solarPadding*2)) * 1000);

    }
    else if(currentTime > sunRise && currentTime < sunSet) {
        //console.log("its the daytime");
        step = 1000;
    }
    else {
        //console.log("its the nighttime");
        step = 0;
    }


    //console.log("step : " + step + " / 1000");
    this.pixels.fillColor(grad.CreateGradientSunlight(1000, step));
};

module.exports = new WeatherTracker()