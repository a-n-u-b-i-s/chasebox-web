const gulp = require('gulp');
const ts = require('gulp-typescript');
const zip = require('gulp-zip');
const lambda = require('gulp-lambda-deploy');

let params = {
    name: 'chasebox-mail-parse-router',
    role: 'arn:aws:iam::059581416755:role/lambda-s3-basic-execution',
    publish: true,
    runtime: 'nodejs12.x'
};

let options = {
    profile: 'default',
    region: 'us-east-1'
};

function typescript(cb) {
    return gulp.src('src/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            target: 'ESNext',
            outFile: 'index.js'
        }))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
}

function lambdazip(cb) {
    return gulp.src('dist/**')
        .pipe(zip('package.zip'))
        .pipe(gulp.dest('build'))
        .pipe(lambda(params, options))
        .on('end', cb);
};

exports.default = gulp.series(typescript, lambdazip);