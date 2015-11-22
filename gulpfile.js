var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	minifyCSS = require('gulp-minify-css'),
	path = require('gulp-path'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
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
	libraries:{
		watch: 'bower.json'
	},
	scripts:{
		src: ['app/scripts/main.js'],
		distFile: ['main.js'],
		dist: 'dist/scripts'
	},
	style:{
		src: ['app/styles/**.scss'],
		distFile: 'main.css',
		dist: 'dist/styles/'
	},
  }
};

// ----- DEFAULT TASK -----
gulp.task('default', ['script', 'style', 'libraries', 'watch']);

// ----- WATCH TASK -----
gulp.task('watch', function(){
	gulp.watch(settings.paths.scripts.src, ['script']);
	gulp.watch(settings.paths.style.src, ['style']);
	gulp.watch(settings.paths.libraries.watch, ['libraries']);
});


// ----- SCRIPT TASK -----
gulp.task('script', function() {
	for (i = 0; i < settings.paths.scripts.src.length; i++) { 
	gulp.src(settings.paths.scripts.src[i])
		.pipe(plumber())
		.pipe(gulpif(settings.production, uglify()))
		.pipe(concat(settings.paths.scripts.distFile[i]))
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

		//---------- js -------
		.pipe(jsFilter)
		.pipe(gulp.dest(settings.paths.distribution + '/js/'))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.distribution + '/js/'))
		.pipe(jsFilter.restore)

		//---------- css -------
		.pipe(cssFilter)
		.pipe(gulp.dest(settings.paths.distribution + '/css'))
		.pipe(minifyCSS())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.distribution + '/css'))
		.pipe(cssFilter.restore)

		//---------- sass -------
		.pipe(sassFilter)
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCSS())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(settings.paths.distribution + '/css'));
		lpipe(sassFilter.restore)
		//---------- font -------
		.pipe(fontFilter)
		.pipe(flatten())
		.pipe(gulp.dest(settings.paths.distribution + '/fonts'));
});
