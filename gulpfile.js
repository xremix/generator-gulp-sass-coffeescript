var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var minify-css = require('gulp-minify-css');
var path = require('gulp-path');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var plumber = require('plumber');



// ----- SETTINGS -----
var settings = {
  production:true,
  paths:{
  	src: {
  		scripts:['app/scripts/**.js']
  	},
  	dist:{
  		scripts:['dist/scripts/**.js']	
  	}
  }
};

// ----- DEFAULT TASK -----
gulp.task('default', ['script', 'style']);


// ----- SCRIPT TASK -----
gulp.task('script', function() {
  console.log("Hello Script!");
});

// ----- STYLE TASK -----
gulp.task('style', function() {
  console.log("Hello Style!");
});


