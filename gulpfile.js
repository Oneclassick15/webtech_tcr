const gulp = require('gulp');
const fs = require('fs');
const njk = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify');
const bs = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const Prac1Data = require('./src/data/prac1.json');

function del(dirs) {
  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  });
}

function clean(cb) {
  del(['./dist']);
  cb();
}

function cleanStyles(cb) {
  del(['./dist/assets/css']);
  cb();
}

function html() {
  return gulp
    .src('src/html/pages/**/*.+(html|njk)')
    .pipe(njk({ path: ['src/html/'], data: { Prac1Data } }))
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: true }))
    .pipe(gulp.dest('./dist'));
}

function scss() {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(bs.stream());
}

function moveAssets() {
  return gulp.src('src/assets/**/*').pipe(gulp.dest('./dist/assets'));
}

function moveJs() {
  return gulp.src('src/js/**/*').pipe(gulp.dest('./dist/assets/js'));
}

function serve() {
  bs.init({
    server: {
      baseDir: './dist',
    },
    ghostMode: false,
    notify: false,
  });

  gulp.watch('src/html/**/*.+(html|njk)', html);
  gulp.watch('src/scss/**/*.scss', gulp.series(cleanStyles, scss));
  gulp.watch(['./dist/**/*', '!./dist/assets/css/*']).on('change', bs.reload);
  gulp.watch('src/assets/**/*', moveAssets);
  gulp.watch('src/js/**/*', moveJs);
}

exports.build = gulp.series(
  clean,
  gulp.parallel(moveAssets, moveJs, html, scss),
);
exports.default = gulp.series(
  clean,
  gulp.parallel(moveAssets, moveJs, html, scss),
  serve,
);
