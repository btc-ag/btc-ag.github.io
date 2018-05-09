let gulp = require("gulp");
let pug = require("gulp-pug");
let sass = require("gulp-sass");
let minifyCss = require("gulp-csso");
let concat = require("gulp-concat");

gulp.task("html", function() {
    return gulp.src("src/html/*.pug")
        .pipe(pug())
        .pipe(gulp.dest("dist/"));
});

gulp.task("css", function() {
    return gulp.src("src/css/*.scss")
        .pipe(sass()).on('error', sass.logError)
        .pipe(minifyCss())
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("js", function() {
    return gulp.src("src/js/*.js")
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("img", function() {
    return gulp.src("src/img/*")
        .pipe(gulp.dest("dist/img"));
});
gulp.task("fonts", function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("default", ["html", "css", "js", "img", "fonts"]);

gulp.task("watch", ["default"], function() {
    gulp.watch("src/html/*.pug", ['html']);
    gulp.watch("src/css/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/img/*", ['img']);
    gulp.watch("src/fonts/**/*", ['fonts']);
});