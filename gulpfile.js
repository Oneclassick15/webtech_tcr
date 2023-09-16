const gulp = require('gulp');
const fs = require('fs');
const njk = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify');
const bs = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

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
  del(['./dist/css']);
  cb();
}

function html() {
  return gulp
    .src('src/html/pages/**/*.+(html|njk)')
    .pipe(njk({ path: ['src/html/'] }))
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(gulp.dest('./dist'));
}

function scss() {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(bs.stream());
}

function moveAssets() {
  return gulp.src('src/assets/**/*').pipe(gulp.dest('./dist/assets'));
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
  gulp.watch(['./dist/**/*', '!./dist/css/*']).on('change', bs.reload);
  gulp.watch('src/assets/**/*', moveAssets);
}

exports.build = gulp.series(clean, gulp.parallel(moveAssets, html, scss));
exports.default = gulp.series(
  clean,
  gulp.parallel(moveAssets, html, scss),
  serve,
);
