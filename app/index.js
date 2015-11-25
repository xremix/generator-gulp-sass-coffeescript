var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
	constructor: function(){
		//Calling super constructor
		generators.Base.apply(this, arguments);
	},
	promting: function(){
		var done = this.async();

		var promts = [{
			type    : 'input',
			name    : 'name',
			message : 'Project Name',
			default : this.appname
		},{
			type    : 'input',
			name    : 'version',
			message : 'Project Version',
			default : '0.0.1'
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
			this.inputProjectVersion = answers.version;
			function getQuestionAnswer(feat) {
				return answers.dependencies && answers.dependencies.indexOf(feat) !== -1;
			};
			this.loadDependencies = getQuestionAnswer('loadDependencies');
			this.includeCoffeeScript = getQuestionAnswer('includeCoffeeScript');

			done();
		}.bind(this));
	},
	writing: function () {
		this.fs.copyTpl(
			this.templatePath('gulptemplates/**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.inputProjectVersion,
				includeCoffeeScript: this.includeCoffeeScript
			}
		);
		
		this.fs.copyTpl(
			this.templatePath('webtemplates/**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.inputProjectVersion
			}
		);
		var scriptTemplates = this.includeCoffeeScript ? 'gulptemplates/**/*' : 'javascripttemplates/**/*';
		this.fs.copyTpl(
			this.templatePath(scriptTemplates),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.inputProjectVersion,
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
	},
	_writeFiles: function(){
		if(!this.loadDependencies){
			console.log("----------------------------------------------------------------------------");
			console.log("----------------------------------------------------------------------------");
			console.log("----------------------------------------------------------------------------");
			console.log("----------------------------------------------------------------------------");
			console.log("---- Run the following comands to install Dependencies Dependencies now ----");
			console.log("--------------------------------npm install---------------------------------");
			console.log("-------------------------------bower install--------------------------------");
			console.log("----------------------------------------------------------------------------");
			console.log("----------------------------------------------------------------------------");
			console.log("----------------------------------------------------------------------------");
		}
		console.log("           _   _                 _                        ");
		console.log("          | | | |               | |                       ");
		console.log("          | |_| |__   __ _ _ __ | | __  _   _  ___  _   _ ");
		console.log("          | __| '_ \\ / _` | '_ \\| |/ / | | | |/ _ \\| | | |");
		console.log("          | |_| | | | (_| | | | |   <  | |_| | (_) | |_| |");
		console.log("           \\__|_| |_|\\__,_|_| |_|_|\\_\\  \\__, |\\___/ \\__,_|");
		console.log("                                         __/ |            ");
		console.log("                                        |___/             ");
	}
});