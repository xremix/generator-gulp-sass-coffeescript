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
			name	: 'dependencies',
			message : 'What dependencies do you want to load now',
			store	: true,
			choices:[{
				name: 'NPM',
				value: 'loadNPM',
				checked: true
			},{
				name: 'Bower',
				value: 'loadBower',
				checked: true
			}]
		}];

		this.prompt(promts, function (answers) {
			this.inputProjectName = answers.name;
			this.inputProjectVersion = answers.version;
			function shouldLoadDependency(feat) {
				return answers.dependencies && answers.dependencies.indexOf(feat) !== -1;
			};
			this.loadBower = shouldLoadDependency('loadBower');
			this.loadNPM = shouldLoadDependency('loadNPM');

			done();
		}.bind(this));
	},
	writing: function () {
		this.fs.copyTpl(
			this.templatePath('**/*'),
			this.destinationPath('./'),
			{ 
				title: this.inputProjectName,
				version: this.inputProjectVersion
			}
			);
		this.template('temptask.js', 'Gulpfile.js');

	},
	dependencies: function () {
		console.log('Loading dependencies!');
		//TODO
		//name: _s.slugify(this.inputProjectName),
		 var bowerJson = {
	        name: this.inputProjectName,
	        private: true,
	        authors:[],
	        license:"MIT",
	        main:[],
	        keywords:[
	        	"gulp-sass-coffeescript"
	        ],
	        "ignore": [
			    "**/.*",
			    "node_modules",
			    "bower_components",
			    "test",
			    "tests"
			  ],
	        dependencies: {
	        	"jquery": "~2.1.4",
			    "bootstrap": "~3.3.5",
			    "font-awesome": "fontawesome#~4.4.0" 
	        }
	      };
        this.fs.writeJSON('bower.json', bowerJson);
		



		if(this.loadBower){
			console.log("-------- Loading Dependencies for Bower--------");
			this.bowerInstall();
		}
		if(this.loadNPM){
			console.log("-------- Loading Dependencies for NPM --------");
			this.npmInstall();
		}
	}
});