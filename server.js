var http 		= require('http'),

	handler		= require('./static'),

	app			= http.createServer(handler),
	io			= require('socket.io').listen(app),

	spi 		= require('spi'),
    fs = require('fs'),
	RPixel		= require('raspberrypixels'),

	AvailableAnimations = require('./animationloader').load()
	Animations	= []

var PIXELS  = parseInt(process.env.PIXELS, 10) || 32
var DEVICE 	= process.env.DEVICE || '/dev/spidev0.0'
var PORT 	= process.env.PORT || 8888

var FPS		= 45
var RUNNING	= true

io.set('log level', 1); // reduce logging

app.listen(parseInt(PORT, 10))

console.log("HTTP server listening on port " + PORT)

var Device				= new spi.Spi(DEVICE, function(){});
var Pixels 				= new RPixel.PixelBuffer(PIXELS)
var ActiveAnimations 	= []
var Frame 				= 0
var ReadBuffer			= new Buffer(PIXELS * 3)

for(var i = 0; i < AvailableAnimations.length; i++){
	Animations.push(new AvailableAnimations[i](PIXELS))
}


Pixels.fillRGB(0, 0,0);

var d = fs.createWriteStream("/dev/spidev0.0", {flags:'w',encoding:null,mode:0666});

RenderStrip() // Begin the strip animation

io.sockets.on('connection', function (socket) {
	socket.emit('initialize', {
		animations: Strip(Animations),
		activeAnimations: Strip(ActiveAnimations)
	})

	socket.on('animations', function(activeAnimations){
		ActiveAnimations = []

		for(var i = 0; i < activeAnimations.length; i++){
			for(var a = 0; a < Animations.length; a++){
				if(activeAnimations[i].name == Animations[a].name){
					var anim = new AvailableAnimations[a](PIXELS)
					anim.config = activeAnimations[i].config;

					ActiveAnimations.push(anim)
				}
			}
		}

		socket.broadcast.emit('animations', activeAnimations)
	})

	socket.on('toggle', function(){
		RUNNING = !RUNNING

		socket.broadcast.emit('status', RUNNING)
	})
})


function Strip(arr){
	var animations = JSON.stringify(arr.slice())
		animations = JSON.parse(animations)

	delete animations.frame

	return animations
}


function RenderStrip(){
	//for(var i = 0; i < ActiveAnimations.length; i++){
    if(ActiveAnimations.length > 0) {
        Pixels = ActiveAnimations[ActiveAnimations.length-1].requestFrame(Frame, Pixels);
    }

	//}

    if(ActiveAnimations.length == 0) {
        Pixels.clear();
    }


    //console.log(Pixels.buffer);
	Device.transfer(Pixels.buffer, Pixels.readBuffer)
    //d.write(Pixels.get());


	if(RUNNING){
		Frame++
        if(Frame > FPS * 60) {
            Frame = 0;
        }
		setTimeout(RenderStrip, 1000 / FPS)
	}
}

