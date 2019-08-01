const fs = require('fs');
const sh = require('shelljs');
const chalk = require('chalk');
const gulp = require('gulp');
const uglify = require('uglify-js');
const csso = require('csso');

const uglifyFiles = [
    {
        src: './js/OverlayScrollbars.js',
        dest: './js/OverlayScrollbars.min.js',
    },
    {
        src: './js/jquery.overlayScrollbars.js',
        dest: './js/jquery.overlayScrollbars.min.js',
    }
];
const cssoFiles = [
    {
        src: './css/OverlayScrollbars.css',
        dest: './css/OverlayScrollbars.min.css',
    }
];

sh.echo(chalk.cyanBright('Start building:'));

gulp.task('uglify', function (done) {
    uglifyFiles.forEach((file) => {
        if (sh.test('-f', file.src)) {
            sh.echo(chalk.yellowBright('uglify: ') + chalk.greenBright(`${file.src} → ${file.dest}`));
            sh.ShellString(uglify.minify(fs.readFileSync(file.src, 'utf-8'), {
                ie8: true,
                compress: {
                    ie8: true
                },
                mangle: {
                    ie8: true,
                    properties: {
                        'regex': /^_/
                    }
                },
                output: {
                    ie8: true,
                    beautify: false,
                    comments: /@license|@preserve|^!/,
                    indent_level: 4,
                    indent_start: 0,
                    quote_style: 0
                }
            }).code).to(file.dest);
        }
        else {
            sh.echo(chalk.redBright(`${file.src} not found!`));
        }
    });
    done();
});

gulp.task('csso', function (done) {
    cssoFiles.forEach((file) => {
        if (sh.test('-f', file.src)) {
            sh.echo(chalk.yellowBright('csso: ') + chalk.greenBright(`${file.src} → ${file.dest}`));
            sh.ShellString(csso.minify(fs.readFileSync(file.src, 'utf-8'), {
                restructure: false,
                comments: 'first-exclamation'
            }).css).to(file.dest);
        }
        else {
            sh.echo(chalk.redBright(`${file.src} not found!`));
        }
    });
    done();
});

gulp.parallel('uglify', 'csso')();