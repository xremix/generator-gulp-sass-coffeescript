var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	uglify = require('gulp-uglify'),
	coffee = require('gulp-coffee'),
	path = require('gulp-path'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	flatten = require('gulp-flatten'),
	gulpFilter = require('gulp-filter'),
	rename = require('gulp-rename'),
	mainBowerFiles = require('main-bower-files'),
	watch = require('gulp-watch');


// ----- SETTINGS -----
var settings = {
  production:true,
  paths:{
	distribution: 'dist',
	web:{
		src:[
			'app/**/*.htm*',
			'app/**/*.php'
		],
		dist:'dist'
	},
	scripts:{
		js:{
			src: ['app/scripts/main.js'],
			distFile: ['main.js'],
		},
		coffee:{
			src: ['app/scripts/myfile.coffee'],
			distFile: ['coffee.js'],
		},
		dist: 'dist/scripts'
	},
	style:{
		src: ['app/styles/**.scss'],
		distFile: 'main.css',
		dist: 'dist/styles/'
	},
	libraries:{
		watch: 'bower.json'
	},
  }
};

// ----- DEFAULT TASK -----
gulp.task('default', ['web', 'script', 'coffee', 'style', 'libraries', 'watch']);

// ----- WATCH TASK -----
gulp.task('watch', function(){
	gulp.watch(settings.paths.web.src, ['web']);
	gulp.watch(settings.paths.scripts.js.src, ['script']);
	gulp.watch(settings.paths.scripts.coffee.src, ['coffee']);
	gulp.watch(settings.paths.style.src, ['style']);
	gulp.watch(settings.paths.libraries.watch, ['libraries']);
});


// ----- WEB TASK -----
gulp.task('web', function(){
	gulp.src(settings.paths.web.src)
	.pipe(plumber())
	.pipe(gulpif(settings.production, minifyHTML({})))
	.pipe(gulp.dest(settings.paths.web.dist));
});

// ----- SCRIPT TASK -----
gulp.task('script', function() {
	for (i = 0; i < settings.paths.scripts.js.src.length; i++) { 
		gulp.src(settings.paths.scripts.js.src[i])
			.pipe(plumber())
			.pipe(gulpif(settings.production, uglify()))
			.pipe(concat(settings.paths.scripts.js.distFile[i]))
			.pipe(gulpif(settings.production, rename({
				suffix: ".min"
			})))
			.pipe(gulp.dest(settings.paths.scripts.dist));
	}
});
// ----- COFFEE TASK -----
gulp.task('coffee', function() {
	for (i = 0; i < settings.paths.scripts.coffee.src.length; i++) { 
		gulp.src(settings.paths.scripts.coffee.src[i])
			.pipe(plumber())
			.pipe(coffee({bare: true}))
			.pipe(gulpif(settings.production, uglify()))
			.pipe(concat(settings.paths.scripts.coffee.distFile[i]))
			.pipe(gulpif(settings.production, rename({
				suffix: ".min"
			})))
			.pipe(gulp.dest(settings.paths.scripts.dist));
	}
});

// ----- STYLE TASK -----
gulp.task('style', function() {
	gulp.src(settings.paths.style.src)
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	.pipe(concat(settings.paths.style.distFile))
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
		}))
	.pipe(gulpif(settings.production, minifyCSS()))
	.pipe(gulpif(settings.production, rename({
		suffix: ".min"
	})))
	.pipe(gulp.dest(settings.paths.style.dist));
});


// ----- LIBRARIES TASK -----
gulp.task('libraries', function() {
		var jsFilter = gulpFilter('*.js',{restore:true});
		var cssFilter = gulpFilter(['*.css'],{restore:true});
		var sassFilter = gulpFilter(['*.scss'],{restore:true});
		var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'],{restore:true});

		return gulp.src(mainBowerFiles())
		.pipe(plumber())

		//---------- js -------
		.pipe(jsFilter)
		.pipe(gulp.dest(settings.paths.scripts.dist))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.scripts.dist))
		.pipe(jsFilter.restore)

		//---------- css -------
		.pipe(cssFilter)
		.pipe(gulp.dest(settings.paths.style.dist))
		.pipe(minifyCSS())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.style.dist))
		.pipe(cssFilter.restore)

		//---------- sass -------
		.pipe(sassFilter)
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCSS())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.style.dist));
		lpipe(sassFilter.restore)
		//---------- font -------
		.pipe(fontFilter)
		.pipe(flatten())
		.pipe(gulp.dest(settings.paths.distribution + '/fonts'));
});
