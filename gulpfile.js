const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const minifyCss = require("gulp-csso");
const concat = require("gulp-concat");

function html() {
    return gulp.src("src/html/*.pug")
        .pipe(pug())
        .pipe(gulp.dest("docs/"));
}

function css() {
    return gulp.src("src/css/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest("docs/css/"));
}

function js() {
    return gulp.src("src/js/*.js")
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("docs/js"));
}

function images() {
    return gulp.src("src/img/*")
        .pipe(gulp.dest("docs/img"));
}

function fonts() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("docs/fonts"));
}

function watch() {
    gulp.watch("src/html/**/*.pug", html);
    gulp.watch("src/css/*.scss", css);
    gulp.watch("src/js/*.js", js);
    gulp.watch("src/img/*", images);
    gulp.watch("src/fonts/**/*", fonts);
}

const build = gulp.parallel(html, css, js, images, fonts);
const dev = gulp.series(build, watch);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.watch = dev;
exports.default = build;