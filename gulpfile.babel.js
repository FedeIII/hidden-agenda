/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import del from 'del';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import sass from 'gulp-sass';
import livereload from 'gulp-livereload';
import webpackConfig from './webpack.config.babel';

const paths = {
    clientBundle: 'dist/client-bundle.js?(.map)',
    allSrcJs: 'src/**/*.js?(x)',
    serverSrcJs: 'src/server/**/*.js?(x)',
    sharedSrcJs: 'src/shared/**/*.js?(x)',
    styles: 'src/client/styles/**/*.scss',
    clientEntryPoint: 'src/client/app.jsx',
    gulpFile: 'gulpfile.babel.js',
    webpackFile: 'webpack.config.babel.js',
    distDir: 'dist',
    libDir: 'lib'
};

gulp.task('lint', () =>
    gulp.src([
        paths.allSrcJs,
        paths.gulpFile,
        paths.webpackFile
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del([
    paths.libDir,
    paths.clientBundle
]));

gulp.task('sass', () =>
    gulp.src(paths.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.distDir))
);

gulp.task('main', ['clean', 'sass'], () =>
    gulp.src(paths.clientEntryPoint)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.distDir))
        .pipe(livereload())
);

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch([paths.allSrcJs, paths.styles], ['main']);
});

gulp.task('default', ['watch', 'main']);
