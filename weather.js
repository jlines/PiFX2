"use strict";
var https = require('https');
var logger = require('log4js').getLogger();
var AnimationSnow = require('./animations/Snow');

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

    this.weatherInterval = 1800 * 1000;

    this.weatherUpdateListeners = [];


}

WeatherTracker.prototype.onStart = function() {
    this.updateWeatherData();
};

WeatherTracker.prototype.initialize = function(pixelBuffer, animations) {
    var self = this;
    this.animations = animations;
    this.pixels = pixelBuffer;

    this.solarEventFlash = new (require('./animations/Flash'))();
    this.TODAnimation = new (require("./animations/TimeOfDay"))();
    this.windAnimation = new (require("./animations/SineWave"))();
    this.visibilityAnimation = new AnimationSnow(this.pixels);

    //start up root animation to display time of day
    this.animations.push(this.TODAnimation);
    this.animations.push(this.windAnimation);
    this.animations.push(this.visibilityAnimation);
};



WeatherTracker.prototype.doFlash = function() {
    var self = this;

    this.solarEventFlash.config.speed.value = 1;
    this.solarEventFlash.config.color.value = {r:0,g:255,b:0};
    //grad2.color3 = this.pixels.getPixel(1).color;
    this.solarEventFlash.duration = 300;
    this.solarEventFlash.frame = 0;
    this.solarEventFlash.complete = false;

    this.animations.push(this.solarEventFlash);
    //setTimeout(function(){self.doFlash();}, 10000);
};

WeatherTracker.prototype.updateWeatherData = function() {
    var self = this;
    var options = {
        host: 'api.forecast.io',
        path: '/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/33.352613,-111.916405'
    };

    //options.path = "/forecast/bcab40cb8d1e3653ee5bff18ba8e6f01/41.618795,-81.199094";

    var request = https.request(options,function(response) {
        var str = '';
        //debugger;

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

	    response.on('error', function(e) {
	        logger.error("error retrieving weather data " + JSON.stringify(e));
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {

            var data = "";

            try {
                data = JSON.parse(str);
            }
            catch(e) {
                logger.error("Unable to parse " + str);
		if(self.trackWeather) {
                	setTimeout(function() {self.updateWeatherData();}, self.weatherInterval);
            	}
                return;
            }

            self.weatherData = data;
            self.sunriseTime = new Date(self.weatherData.daily.data[0].sunriseTime * 1000);
            self.sunsetTime = new Date(self.weatherData.daily.data[0].sunsetTime * 1000);
            self.windSpeed = self.weatherData.currently.windSpeed;
            self.cloudCover = self.weatherData.currently.cloudCover;

            self.TODAnimation.sunriseTime = self.sunriseTime;
            self.TODAnimation.sunsetTime = self.sunsetTime;

            logger.debug("sunrise " + self.sunriseTime);
            logger.debug("sunset " + self.sunsetTime);
            logger.debug("windspeed " + self.windSpeed);
            logger.debug("cloudCover " + self.cloudCover);

            if(self.trackWeather) {
                setTimeout(function() {self.updateWeatherData();}, self.weatherInterval);
            }


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
    var self = this;
    //self.windSpeed = 25;
    //self.cloudCover = .5;
    var wind = Math.floor(((self.windSpeed/25)*100)+30);
    wind = Math.floor((self.windSpeed * 2) + 85);
    logger.info("Wind aNim: " + wind);
    self.windAnimation.config.speed.value = wind; 
    self.visibilityAnimation.cloudCover = self.cloudCover;

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


module.exports = new WeatherTracker();
