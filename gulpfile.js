const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const usemin = require('gulp-usemin');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const tsProject = ts.createProject('tsconfig.json');

const PATHS = {
    nunjucks: './src/templates',
    scss: './src/scss',
    img: './src/img',
    dist: './build/',
    svg: './src/svg/**/*.svg',
    favicon: './src/favicon/**',
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
                precision: 3,
                outputStyle: 'compressed',
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

// function imgMoveFC() {
//     return src(`${PATHS.img}/**`)
//         .pipe(
//             imagemin(
//                 [
//                     imagemin.gifsicle({ interlaced: true }),
//                     imagemin.jpegtran({ progressive: true }),
//                     imagemin.optipng({ optimizationLevel: 5 }),
//                     imagemin.svgo({
//                         plugins: [
//                             { removeViewBox: false },
//                             { cleanupIDs: false },
//                         ],
//                     }),
//                 ],
//                 {
//                     progressive: true,
//                     svgoPlugins: [{ removeViewBox: false }],
//                     use: [pngquant()],
//                 },
//             ),
//         )
//         .pipe(dest(`${PATHS.dist}/img`))
//         .pipe(browserSync.reload({ stream: true }));
// }

function faviconMoveFC() {
    return src(`${PATHS.favicon}/**`)
        .pipe(dest(`${PATHS.dist}`))
        .pipe(browserSync.reload({ stream: true }));
}

function typescriptFC() {
    return tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(dest(`${PATHS.dist}/js`))
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
    watch([PATHS.favicon]).on('change', series('faviconMoveFC'));
}

function useminFC() {
    return src(`${PATHS.dist}**/*.html`)
        .pipe(
            usemin({
                css: [minifyCss, rev],
                html: [
                    function () {
                        return minifyHtml({ empty: true });
                    },
                ],
                js: [uglify, rev],
                inlinejs: [uglify],
                inlinecss: [minifyCss],
            }),
        )
        .pipe(dest(PATHS.dist));
}

exports.serve = serve;
exports.nunjucksFC = nunjucksFC;
exports.sassFC = sassFC;
exports.svgMoveFC = svgMoveFC;
exports.imgMoveFC = imgMoveFC;
exports.typescriptFC = typescriptFC;
exports.faviconMoveFC = faviconMoveFC;
exports.useminFC = useminFC;

exports.default = series(
    nunjucksFC,
    sassFC,
    svgMoveFC,
    imgMoveFC,
    faviconMoveFC,
    serve,
);

exports.build = series(
    nunjucksFC,
    sassFC,
    svgMoveFC,
    imgMoveFC,
    faviconMoveFC,
    useminFC,
);
