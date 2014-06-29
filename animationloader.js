"use strict";

var fs		= require('fs'),
	path	= require('path'),
	_ = require('lodash');

function AnimationLoader(){
    console.log("start anim");
}

AnimationLoader.load = function(){
	var filepath = path.join(process.cwd(), 'animations');

	var files = fs.readdirSync(filepath);

	var animationFiles = _.chain(files)
			      .filter(function(file) { return file.indexOf('.js') > -1; })
			      .map(function(file) { require('./animations/' + file.replace('.js', '')); });

	return animationFiles;
};

module.exports = AnimationLoader;
