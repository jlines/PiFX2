var fs		= require('fs'),
	path	= require('path'),
	_ = require('lodash');

function AnimationLoader(){
    console.log("start anim")
}

AnimationLoader.load = function(){
	var filepath = path.join(process.cwd(), 'animations')

	var files = fs.readdirSync(filepath)

	var animationFiles = _.chain(files)
			      .filter(function(file) { file.indexOf('.js') > -1;})
			      .map(function(file) { require('./animations/' + file.replace('.js', '')); });
	
	/*for(var i = 0; i < files.length; i++){
		if(files[i].indexOf('.js') > -1){
			var animation = require('./animations/' + files[i].replace('.js', ''))

			animationFiles.push(animation)
		}
	}*/

	return animationFiles
}

module.exports = AnimationLoader
