var https = require('https');


function WeatherTracker() {
    var self = this;
    this.weatherData = null;
    this.trackWeather = true;
    this.animations = null;
    this.livePixels = null;
    this.onStart();

    this.ctime = new Date();
    this.ctime.setHours(19);
    this.ctime.setMinutes(2);

    this.sunRiseTime = null;
    this.sunSetTime = null;

    this.weatherInterval = 3600 * 1000;

    this.weatherUpdateListeners = [];

    this.solarEventFlash = new (require('./animations/Gradient'));
    this.TODAnimation = new (require("./animations/TimeOfDay"));
    this.TODAnimation.weatherTracker = this;
    this.windAnimation = new (require("./animations/SineWave"));


}

WeatherTracker.prototype.onStart = function() {
    this.updateWeatherData();
}

WeatherTracker.prototype.setAnimationList = function(animations) {
    this.animations = animations;

    //start up root animation to display time of day


    this.animations.push(this.TODAnimation);
    this.animations.push(this.windAnimation);
}

WeatherTracker.prototype.setPixels = function(pixels) {
    this.pixels = pixels;
}

WeatherTracker.prototype.doFlash = function() {
    var self = this;

    this.solarEventFlash.config.speed.value = 12;
    this.solarEventFlash.config.color1.value = this.pixels.getPixel(1).color;
    this.solarEventFlash.config.color2.value = {r:0,g:255,b:0};
    //grad2.color3 = this.pixels.getPixel(1).color;
    this.solarEventFlash.duration = 12;
    this.solarEventFlash.complete = false;
    this.solarEventFlash.rgb = true;

    this.animations.push(this.grad);
};

WeatherTracker.prototype.updateWeatherData = function() {
    var self = this;
    var options = {
        host: 'api.forecast.io',
        path: '/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/33.504213,-111.911083'
    };

    callback = function(response) {
        var str = '';

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            var data = JSON.parse(str);
            self.weatherData = data;
            self.sunRiseTime = new Date(self.weatherData.daily.data[0].sunriseTime * 1000);
            self.sunSetTime = new Date(self.weatherData.daily.data[0].sunsetTime * 1000);

            if(self.trackWeather) {
                setTimeout(function() {self.updateWeatherData();}, this.weatherInterval);
            }

            this.onWeatherUpdated();
        });
    }

    console.log("Request weather data");

    https.request(options, callback).end();
};


WeatherTracker.prototype.onWeatherUpdated = function(info) {
    this.checkForSolarEvent();

};

WeatherTracker.prototype.checkForSolarEvent = function() {
    var ctime = new Date(), self = this;
    if(this.isDayTime(ctime) & this.sunSetTime-ctime < this.weatherInterval) {
        setTimeout(function() {self.doFlash();}, this.sunSetTime-ctime);
    }
    else if(!this.isDayTime(ctime) & this.sunRiseTime > ctime & this.sunRiseTime-ctime < this.weatherInterval) {
        setTimeout(function() {self.doFlash();}, this.sunRiseTime-ctime);
    }
};

WeatherTracker.prototype.isDaytime = function(currentTime) {
    return (currentTime > this.sunRiseTime && currentTime < this.sunSetTime);
};

WeatherTracker.prototype.setBackgroundFrame = function() {

};

module.exports = new WeatherTracker()