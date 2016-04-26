var gulp = require('gulp');
var scss = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var minifyJS = require('gulp-minify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var webserver = require('gulp-webserver');

gulp.task('default', function(){
  return runSequence('imagemin', 'scss', 'scripts', 'lint', 'scss-lint', 'watch', 'webserver');
});

gulp.task('webserver', function(){
	gulp.src("./public/")
		.pipe(webserver({
		livereload: true,
		dictionaryListing: false,
		open: true
	}));
});

gulp.task('watch', function(){
	gulp.watch([
		'./devel/scss/*.scss',
		'./devel/scss/*/*.scss'
	], ['scss',  'scss-lint']);
	gulp.watch([
		'./devel/scripts/*.js',
		'./devel/scripts/*/*.js',
	], ['scripts', 'lint']);
	});

gulp.task('scss', function () {
  return gulp.src('./devel/scss/style.scss')
  	.pipe(sourcemaps.init())
    .pipe(scss().on('error',
    	function(e) {
    		gutil.log(e);
    		this.emit('end');
    	})
    )
    //.pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('scripts', function() {
	return gulp.src([
        './node_modules/js-polyfills/polyfill.min.js',
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/html5shiv/dist/html5shiv.min.js',

		'./devel/scripts/molecules/moleculeA.js',
		'./devel/scripts/molecules/moleculeB.js',
        './devel/scripts/app.js'
		])
	.pipe(concat('app.min.js'))
	.pipe(sourcemaps.init())
	/*.pipe(minifyJS({mangle: true}).on('error',
    	function(e) {
    		gutil.log(e);
    		this.emit('end');
    	}))*/
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./public/js/'))
});


gulp.task('lint', function() {
  return gulp.src('./devel/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scss-lint', function() {
  return gulp.src('./devel/scss/*/*.scss')
    .pipe(scsslint({'config': 'lintscss.yml'}));
});

gulp.task('html-lint',['html-validate','html-validateClear'],function(){
    return true;
});

gulp.task('imagemin', function(){
    return gulp.src('./devel/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/images'));
});
