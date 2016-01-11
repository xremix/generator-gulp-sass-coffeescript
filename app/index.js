var generators = require('yeoman-generator');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
	constructor: function(){
		//Calling super constructor
		generators.Base.apply(this, arguments);
	},
	promting: function(){
		var done = this.async();
		this.projectVersion = "0.0.1";

		var promts = [{
			type    : 'input',
			name    : 'name',
			message : 'Project Name',
			default : _s.slugify(this.appname)
		},{
			type	: 'checkbox',
			name	: 'includeCode',
			message : 'Wich features do you want to include',
			store	: true,
			choices:[{
				name: 'CoffeeScript',
				value: 'includeCoffeeScript',
				checked: true
			},{
				name: 'Babel (ES6 Transpiler)',
				value: 'includeBabel',
				checked: true
			}]
		},{
			type	: 'checkbox',
			name	: 'dependencies',
			message : 'Do you want to load dependencies',
			store	: true,
			choices:[{
				name: 'Load them',
				value: 'loadDependencies',
				checked: true
			}]
		}];

		this.prompt(promts, function (answers) {
			this.inputProjectName = answers.name;
			function getDependencyAnswer(feat) {
				return answers.dependencies && answers.dependencies.indexOf(feat) !== -1;
			};
			function getIncludeAnswer(feat) {
				return answers.includeCode && answers.includeCode.indexOf(feat) !== -1;
			};
			this.loadDependencies = getDependencyAnswer('loadDependencies');
			this.includeCoffeeScript = getIncludeAnswer('includeCoffeeScript');
			this.includeBabel = getIncludeAnswer('includeBabel');

			done();
		}.bind(this));
	},
	writing: function () {
		this.fs.copyTpl(
			this.templatePath('gulptemplates/**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.projectVersion,
				includeCoffeeScript: this.includeCoffeeScript,
				includeBabel: this.includeBabel
			}
		);
		
		this.fs.copyTpl(
			this.templatePath('webtemplates/**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.projectVersion,
				includeCoffeeScript: this.includeCoffeeScript,
				includeBabel: this.includeBabel
			}
		);

		var scriptTemplates = this.includeCoffeeScript ? 'coffeescripttemplates/**/*' : this.includeBabel ? 'babeltemplates/**/*' : 'javascripttemplates/**/*';
		this.fs.copyTpl(
			this.templatePath(scriptTemplates),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.projectVersion,
				includeCoffeeScript: this.includeCoffeeScript
			}
		);
	},
	dependencies: function () {
		if(this.loadDependencies){
			console.log("-----------------------------------------");
			console.log("-----------------------------------------");
			console.log("-----------------------------------------");
			console.log("-------- Loading Dependencies now--------");
			console.log("-----------------------------------------");
			console.log("-----------------------------------------");
			console.log("-----------------------------------------");
			this.installDependencies();
		}
	}
});