"use strict";
var http 		= require('http'),
	handler		= require('./static'),
    spi 		= require('spi'),
    fs = require('fs'),
    _ = require('lodash'),
	RPixel		= require('raspberrypixels'),
    logger = require('log4js').getLogger(),
	AvailableAnimations = require('./animationloader').load(),
    weather = require("./weather"),
	Animations	= [];

var PIXELS  = parseInt(process.env.PIXELS, 10) || 32;
var DEVICE 	= process.env.DEVICE || '/dev/spidev0.0';
var PORT 	= process.env.PORT || 8888;
var FPS		= 60;
var RUNNING	= true;
var Device				= new spi.Spi(DEVICE, function(){});
var Pixels 				= new RPixel.PixelBuffer(PIXELS);
var ActiveAnimations 	= [];
var Frame 				= 0;
var ReadBuffer			= new Buffer(PIXELS * 3);

function Strip(arr){
	var animations = JSON.stringify(arr.slice());
		animations = JSON.parse(animations);

	delete animations.frame;

	return animations;
}

//MonitorAnimationArray()
function MonitorAnimationArray() {
    logger.debug("Current animations..");
    for(var i = 0; i < ActiveAnimations.length; i++){
        //if(ActiveAnimations.length > 0) {
        var animation = ActiveAnimations[i];
        if(animation === null) {
            logger.debug("null");

        }
        else {
            console.log(animation.name);
        }
    }
    logger.debug("---------------------------------");

    setTimeout(MonitorAnimationArray, 30000);
}


function RenderStrip(){
    Pixels.clear();

    _.each(ActiveAnimations, function(animation) { 
    	animation.requestFrame(Frame, Pixels); 
    	if(animation !== null & animation.hasOwnProperty("complete") & animation.complete === true) {
		    //console.log("Removing animation " + i + " " + ActiveAnimations);
            ActiveAnimations.splice(i,1);
        }
    });

    //console.log(Pixels.buffer);
    var databuffer = Pixels.get();
	Device.transfer(databuffer, new Buffer(databuffer.length));
    //d.write(Pixels.get());


	if(RUNNING){
		Frame++;
        if(Frame > FPS * 3600) {
            Frame = 0;
        }
		setTimeout(RenderStrip, 1000 / FPS);
	}
}

for(var i = 0; i < AvailableAnimations.length; i++){
	Animations.push(new AvailableAnimations[i](PIXELS));
}


Pixels.fillRGB(0, 0,0);

var d = fs.createWriteStream('/dev/spidev0.0', {flags:'w',encoding:null,mode:'0666'});

new RenderStrip(); // Begin the strip animation

//give control of the animation array and image buffer to the weather tracker/controller
weather.initialize(Pixels, ActiveAnimations);

