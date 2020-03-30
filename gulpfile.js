const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const sass = require('gulp-sass');

const PATHS = {
    nunjucks: './src/templates',
    scss: './src/scss',
    img: './src/img',
    dist: './build/',
    svg: './src/svg/**/*.svg',
};

function getDataForFile(file) {
    return require(`${file.path.split('.')[0]}.json`);
}

function nunjucksFC() {
    return src(`${PATHS.nunjucks}/*.html`)
        .pipe(data(getDataForFile))
        .pipe(
            nunjucksRender({
                path: ['./src/templates'],
            }),
        )
        .pipe(dest(PATHS.dist))
        .pipe(browserSync.reload({ stream: true }));
}

function sassFC() {
    return src(`${PATHS.scss}/*.scss`)
        .pipe(
            sass({
                precision: 10,
            }),
        )
        .pipe(dest(`${PATHS.dist}/css`))
        .pipe(browserSync.reload({ stream: true }));
}

function svgMoveFC() {
    return src(PATHS.svg)
        .pipe(dest(`${PATHS.dist}/svg`))
        .pipe(browserSync.reload({ stream: true }));
}

function imgMoveFC() {
    return src(`${PATHS.img}/**`)
        .pipe(dest(`${PATHS.dist}/img`))
        .pipe(browserSync.reload({ stream: true }));
}

function serve() {
    browserSync({
        server: {
            baseDir: PATHS.dist,
        },
    });

    watch([`${PATHS.nunjucks}/**`]).on('change', series('nunjucksFC'));
    watch([`${PATHS.scss}/**`]).on('change', series('sassFC'));
    watch([PATHS.svg]).on('change', series('svgMoveFC'));
}

exports.serve = serve;
exports.nunjucksFC = nunjucksFC;
exports.sassFC = sassFC;
exports.svgMoveFC = svgMoveFC;
exports.imgMoveFC = imgMoveFC;

exports.default = series(nunjucksFC, sassFC, svgMoveFC, imgMoveFC, serve);
