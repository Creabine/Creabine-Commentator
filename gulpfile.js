var gulp=require('gulp');
var minicss=require('gulp-minify-css');
var uglify=require('gulp-uglify');
var rename=require('gulp-rename');
var jshint=require('gulp-jshint');

gulp.task('jshint',function(){
    return gulp.src('./src/Creabine-Commentator.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('minicss',function(){
    gulp.src('./src/Creabine-Commentator.css')
    .pipe(rename({suffix:'.min'}))
    .pipe(minicss())
    .pipe(gulp.dest('./dist'));
})

gulp.task('minijs',function(){
    gulp.src('./src/Creabine-Commentator.js')
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
})

gulp.task('default',['jshint'],function(){
    gulp.start('minicss','minijs');
})