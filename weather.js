var https = require('https');

function WeatherTracker() {
    this.weatherData = null;
    this.trackWeather = true;
    this.animations = null;

    this.onStart();
}

WeatherTracker.prototype.onStart = function() {
    this.updateWeatherData();
}

WeatherTracker.prototype.setAnimationList = function(animations) {
    this.animations = animations;

    grad = new (require('./animations/Gradient'));
    console.log(grad);
    grad.config.speed.value = 2500;
    this.animations.push(grad);

    this.doFlash();
}

WeatherTracker.prototype.doFlash = function() {
    var self = this;

    grad2 = new (require('./animations/Gradient'));
    grad2.config.speed.value = 5;
    grad2.config.color1.value = {r:0,g:50,b:0};
    grad2.config.color2.value = {r:0,g:255,b:0};
    grad2.duration = 5;
    grad2.rgb = true;

    this.animations.push(grad2);
    console.log("Pushing flash anim");

    setTimeout(function() {self.doFlash();}, 15000);

}

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

    console.log("Requat weather data");

    https.request(options, callback).end();
}

module.exports = new WeatherTracker()