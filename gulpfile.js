var gulp = require("gulp"),
    $ = require("gulp-load-plugins")({
        lazy: true
    }),
    browserSync = require("browser-sync"),
    runSequence = require("run-sequence"),
    del = require("del");


gulp.task("watch", function() {
    gulp.watch(["css/*.css", "js/*.js, *.html"], browserSync.reload);
});

gulp.task("server", function() {
    $.util.log( $.util.colors.yellow("Uruchamianie serwera źródłowego...") );
    browserSync.init({
        server:{
            baseDir: './'
        }
    });

});

gulp.task("css", function() {
    $.util.log( $.util.colors.yellow("Kompilowanie CSS...") );
    return gulp.src("css/*.css")
        .pipe($.autoprefixer({
            browsers: ["last 5 version", "IE 9"]
        }))
        .pipe(gulp.dest("app/css/"))
        .pipe(browserSync.stream());
});

gulp.task("htmljs", function() {
    $.util.log( $.util.colors.yellow("Kompilowanie HTML & JS...") );
    gulp.src("./*.html")
        .pipe($.useref())
        .pipe( $.if("*.js", $.uglify() ) )
        .pipe(gulp.dest("app/"));
});

gulp.task("copy", function() {
    return gulp.src(["js/*.js"], {
        base: "./"
    })
    .pipe(gulp.dest("app/"));

});

gulp.task("clean", function() {
    $.util.log( $.util.colors.yellow("Czyszczenie plików...") );
    return del("app/");
});

gulp.task("build", function(cb) {
    runSequence("clean", "css", "htmljs", "copy", cb);
});

gulp.task("build:server", ["build"], function() {
    $.util.log( $.util.colors.yellow("Uruchamianie serwera deweloperskiego...") );
    browserSync.init({
        server: "app/"
    });

});

gulp.task("default", ["server", "watch"]);