var generators = require('yeoman-generator');

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
			default : this.appname
		},{
			type	: 'checkbox',
			name	: 'includeCode',
			message : 'What do you want to include',
			store	: true,
			choices:[{
				name: 'CoffeeScript',
				value: 'includeCoffeeScript',
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
				includeCoffeeScript: this.includeCoffeeScript
			}
		);
		
		this.fs.copyTpl(
			this.templatePath('webtemplates/**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.projectVersion,
				includeCoffeeScript: this.includeCoffeeScript
			}
		);

		var scriptTemplates = this.includeCoffeeScript ? 'coffeescripttemplates/**/*' : 'javascripttemplates/**/*';
		console.log(scriptTemplates);
		console.log(scriptTemplates);
		console.log(scriptTemplates);
		console.log(scriptTemplates);
		console.log(scriptTemplates);
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
		//TODO
		//name: _s.slugify(this.inputProjectName),

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