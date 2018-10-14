'use strict';

// Подключим зависимости
var fs = require('fs');
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var sortCSSmq = require('sort-css-media-queries');
var atImport = require('postcss-import');
var cleancss = require('gulp-cleancss');
var inlineSVG = require('postcss-inline-svg');

var fileinclude = require('gulp-file-include');
var sourcemaps = require('gulp-sourcemaps');
var wait = require('gulp-wait');

var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gulpIf = require('gulp-if');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var size = require('gulp-size');
var del = require('del');
var newer = require('gulp-newer');

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		images: 'build/images/',
		media: 'build/media/',
		pages: 'build/',
		favicon: 'build/favicon',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/common.js',
		style: 'src/style/style.scss',
		images: 'src/images/',
    svg: 'src/images/svg/',
    imagesBg: 'src/images/img_to_bg/',
		media: 'src/media/**/*.*',
		pages: 'src/pages/*.html',
		favicon: 'src/favicon/**/*.*',
		fonts: 'src/fonts/'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.*css',
		images: 'src/images/**/*.*',
    svg: 'src/images/svg/*.*',
		media: 'src/media/**/*.*',
		pages: 'src/pages/*.html',
		favicon: 'src/favicon/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

var svgSpriteName = 'sprite-svg.svg';

var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000
};

// // Определим разработка это или финальная сборка
// // Запуск `NODE_ENV=production npm start [задача]` приведет к сборке без sourcemaps
var isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

// // Очистка папки сборки
gulp.task('clean', function () {
  console.log('---------- Очистка папки сборки');
  return del(path.clean);
});

// // Сборка HTML
gulp.task('build:html', function() {
  var replace = require('gulp-replace');
  console.log('---------- сборка HTML');
  return gulp.src([path.src.html, path.src.pages])
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'HTML compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
    .pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});


// // Плагины postCSS, которыми обрабатываются все стилевые файлы
var postCssPlugins = [
  autoprefixer({
    browsers: ['last 2 version']
  }),
  mqpacker({
    sort: sortCSSmq.desktopFirst
  }),
  atImport(),
  inlineSVG()
];

// Компиляция стилей проекта

gulp.task('build:style', function () {
  var sass = require('gulp-sass');
  console.log('---------- Компиляция стилей');
  return gulp.src(path.src.style)
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'Styles compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(wait(100))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(debug({title: 'Style:'}))
    .pipe(sass())
    .pipe(postcss(postCssPlugins))
    .pipe(gulpIf(!isDev, cleancss({keepBreaks: false})))
    .pipe(rename('style.min.css'))
    .pipe(gulpIf(isDev, sourcemaps.write('/')))
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({
			stream: true
		}));
});

// // Копирование изображений
gulp.task('build:images', function () {
  console.log('---------- Копирование изображений');
  return gulp.src(['!' + path.src.imageBg + '**/*', '!' + path.src.svg + '**/*', path.src.images + '**/*.{jpg,jpeg,gif,png,svg}'])
    .pipe(newer(path.build.images))  // оставить в потоке только изменившиеся файлы
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.images))
    .pipe(reload({
			stream: true
		}));
});

// // Оптимизация изображений // folder=src/img npm start img:opt
gulp.task('opt:images', function () {
  var imagemin = require('gulp-imagemin');
  var pngquant = require('imagemin-pngquant');
  console.log('---------- Оптимизация картинок');
  return gulp.src(['!' + path.build.images + svgSpriteName, '!' + path.src.imagesBg, path.build.images + '*.{jpg,jpeg,gif,png,svg}'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.build.images));
});

// // Копирование шрифтов
gulp.task('build:fonts', function () {
  console.log('---------- Копирование шрифтов');
  return gulp.src(path.src.fonts + '**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(newer(path.build.fonts))  // оставить в потоке только изменившиеся файлы
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.fonts));
});

// Копирование фавиконки
gulp.task('build:favicon', function () {
  console.log('---------- Копирование favicon');
  return gulp.src(path.src.favicon)
    .pipe(newer(path.build.favicon))  // оставить в потоке только изменившиеся файлы
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.favicon))
    .pipe(reload({
			stream: true
		}));
});

// Копирование медиа
gulp.task('build:media', function () {
  console.log('---------- Копирование media');
  return gulp.src(path.src.media)
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.media))
    .pipe(reload({
			stream: true
		}));
});

// // Конкатенация и углификация Javascript
gulp.task('build:js', function () {
  var uglify = require('gulp-uglify');
  var babel = require('gulp-babel');
  var concat = require('gulp-concat');
  console.log('---------- Обработка JS');
  return gulp.src(path.src.js)
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'Javascript concat/uglify error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
		.pipe(wait(100))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('script.min.js'))
    .pipe(gulpIf(!isDev, uglify()))
		.pipe(gulpIf(isDev, sourcemaps.write('/')))
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
			stream: true
		}));
});

// Сборка SVG-спрайта для блока sprite-svg

gulp.task('sprite:svg', function () {
  var spriteSvgPath = path.src.svg;

  var svgstore = require('gulp-svgstore');
  var svgmin = require('gulp-svgmin');
  var cheerio = require('gulp-cheerio');

  if(fileExist(spriteSvgPath) !== false) {
    console.log('---------- Сборка SVG спрайта');
    return gulp.src(spriteSvgPath + '*.svg')
      // .pipe(svgmin(function (file) {
      //   return {
      //     plugins: [{
      //       cleanupIDs: {
      //         minify: true
      //       }
      //     }]
      //   }
      // }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio({
        run: function($) {
          $('svg').attr('style',  'display:none');
        },
        parserOptions: {
          xmlMode: true
        }
      }))
      .pipe(rename(svgSpriteName))
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest(path.src.images))
      .pipe(gulp.dest(path.build.images));
  }
  else {
    console.log('---------- Сборка SVG спрайта: ОТМЕНА, нет папки с картинками');
  }
});

// Сборка всего
gulp.task('build', gulpSequence(
    'clean',
    'sprite:svg',
    [ 'build:html', 'build:style', 'build:js', 'build:images', 'opt:images', 'build:favicon', 'build:fonts', 'build:media']
));

// Задача по умолчанию
gulp.task('default', ['serve']);

// Локальный сервер, слежение
gulp.task('serve', ['build'], function() {
  browserSync.init(config);

  // Слежение за html
  gulp.watch([path.watch.html], ['build:html']);

  // Слежение за стилями
  gulp.watch([path.watch.style], ['build:style']);

  // Слежение за js
  gulp.watch([path.watch.js], ['build:js']);

  // Слежение за изображениями
  gulp.watch([path.src.images + '*.{jpg,jpeg,gif,png,svg}', '!' + path.src.svg], ['build:images', 'opt:images']);

  // Слежение за svg sprite
  gulp.watch([path.watch.svg], ['sprite:svg']);

  // Слежение за svg background

  gulp.watch([path.src.imagesBg + '*.svg'], ['build:style']);

  // Слежение за favicon
  gulp.watch([path.watch.favicon], ['build:favicon']);

  // Слежение за шрифтами
  gulp.watch([path.watch.fonts], ['build:fonts']);

  // Слежение за media
  gulp.watch([path.watch.media], ['build:media']);
});

/**
 * Проверка существования файла или папки
 * @param  {string} path      Путь до файла или папки]
 * @return {boolean}
 */
function fileExist(path) {
  var fs = require('fs');
  try {
    fs.statSync(path);
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}
