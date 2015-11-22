var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
	constructor: function(){
		//Calling super constructor
		generators.Base.apply(this, arguments);
	},
	writing: function () {
		/*this.fs.copyTpl(
			this.templatePath('*'),
			this.destinationPath('./'),
			{ title: 'Templating with Yeoman' }
		);*/
	},
	finishing: function () {
		console.log('You got it!');
	}
});