var https = require('https');
var logger = require('log4js').getLogger();

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

    this.sunriseTime = null;
    this.sunsetTime = null;

    this.weatherInterval = 1800z * 1000;

    this.weatherUpdateListeners = [];

    this.solarEventFlash = new (require('./animations/Flash'));
    this.TODAnimation = new (require("./animations/TimeOfDay"));
    this.windAnimation = new (require("./animations/SineWave"));
}

WeatherTracker.prototype.onStart = function() {
    this.updateWeatherData();
}

WeatherTracker.prototype.setAnimationList = function(animations) {
    var self = this;
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

    this.solarEventFlash.config.speed.value = 1;
    this.solarEventFlash.config.color.value = {r:0,g:255,b:0};
    //grad2.color3 = this.pixels.getPixel(1).color;
    this.solarEventFlash.duration = 20;
    this.solarEventFlash.frame = 0;
    this.solarEventFlash.complete = false;

    this.animations.push(this.solarEventFlash);
    //setTimeout(function(){self.doFlash();}, 10000);
};

WeatherTracker.prototype.updateWeatherData = function() {
    var self = this;
    var options = {
        host: 'api.forecast.io',
        path: '/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/33.504213,-111.911083'
    };

    options.path = "/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/41.618795,-81.199094";

    var request = https.request(options,function(response) {
        var str = '';
        //debugger;

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {

            var data = JSON.parse(str);
            logger.debug(data);
            self.weatherData = data;
            self.sunriseTime = new Date(self.weatherData.daily.data[0].sunriseTime * 1000);
            self.sunsetTime = new Date(self.weatherData.daily.data[0].sunsetTime * 1000);
            self.windSpeed = self.weatherData.currently.windSpeed;

            self.TODAnimation.sunriseTime = self.sunriseTime;
            self.TODAnimation.sunsetTime = self.sunsetTime;

            logger.debug("sunrise " + self.sunriseTime);
            logger.debug("sunset " + self.sunsetTime);
            logger.debug("windspeed " + self.weatherData.currently.windSpeed);

            if(self.trackWeather) {
                setTimeout(function() {self.updateWeatherData();}, self.weatherInterval);
            }

            self.windAnimation.config.speed.value = Math.floor(((self.windSpeed/30)*100)+30);
            self.onWeatherUpdated();
        });


    });

    request.on('error', function(e) {
        logger.error("error retrieving weather data " + JSON.stringify(e));

        if(self.trackWeather) {
            setTimeout(function() {self.updateWeatherData();}, 5000);
        }
    });

    request.end();


};


WeatherTracker.prototype.onWeatherUpdated = function(info) {
    this.checkForSolarEvent();

};

WeatherTracker.prototype.checkForSolarEvent = function() {
    var ctime = new Date(), self = this;
    if(this.isDaytime(ctime) & this.sunsetTime-ctime < this.weatherInterval) {
        setTimeout(function() {self.doFlash();}, this.sunsetTime-ctime);
        logger.warn("Setting green flash timeout " + (this.sunsetTime-ctime));
    }
    else if(!this.isDaytime(ctime) & this.sunriseTime > ctime & this.sunriseTime-ctime < this.weatherInterval) {
        setTimeout(function() {self.doFlash();}, this.sunriseTime-ctime);
        logger.warn("Setting green flash timeout " + (this.sunriseTime-ctime));
    }
};

WeatherTracker.prototype.isDaytime = function(currentTime) {
    return (currentTime > this.sunriseTime && currentTime < this.sunsetTime);
};


module.exports = new WeatherTracker()
