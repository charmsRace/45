(function() {
    'use strict';

    var gulp = require('gulp');
    var path = require('path');
    var del = require('del');
    var replace = require('gulp-replace');
    var webpack = require('webpack-stream');

    var wpConfig = require(path.join(__dirname, 'webpack.config.js'));

    var dir = {
        srv: path.join(__dirname, 'server'),
        in: path.join(__dirname, 'client', 'src'),
        out: path.join(__dirname, 'client', 'www'),
    };

    var files = {
        html: {
            in: [
                path.join(dir.in, '**', '*.html'),
            ],
        },
        js: {
            in: path.join(dir.in, 'entry.js'),
            out: path.join(dir.out, 'bundle.js'),
        },
    };

    gulp.on('error', function(err) {
        console.log('Gulp has encountered an error:\n');
        throw err;
    });

    gulp.task('clean', function() {
        var options = {
            dryRun: false,
        };

        return del(
            [path.join(dir.out, '**', '*')],
            options
        ).then(function(paths) {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    });

    gulp.task('html', function() {
        var target = '<!-- inject:js -->';
        var injection = '<script type="text/javascript" src="bundle.js"></script>';

        gulp
            .src(files.html.in)
            .pipe(replace(target, injection))
            .pipe(gulp.dest(dir.out));
    });

    gulp.task('less', function() {
        /* */
    });

    gulp.task('js', function() {
        return (
            gulp
                .src(files.js.in)
                .pipe(webpack(wpConfig))
                .pipe(gulp.dest(dir.out))
        );
    });

}());
