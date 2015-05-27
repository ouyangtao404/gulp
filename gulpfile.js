var gulp = require('gulp');
var concat = require('gulp-concat');
//var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var contentIncluder = require('gulp-content-includer');
var fs = require('fs');
var test = require('gulp-test');


var prefix = './wd';
var paths = {
    scripts:[prefix+ '/mods/unitaryConfig/assets/*.js', prefix+ '/mods/!unitaryConfig/assets/*.js'],
    css: 'client/img/**/*'
};

gulp.task('layout', function() {
    (function (path, cb){
        fs.readdir(path, function(err, files){
            //err 为错误 , files 文件名列表包含文件夹与文件
            if(err){console.log(err); return;}

            files.forEach(function(file){
                fs.stat(path + '/' + file, function(err, stat){
                    if(err){console.log(err); return;}
                    if(stat.isDirectory() && file.indexOf('m_') != -1){// 如果是m_名称前缀的文件夹
                        var path2 =  path + file;

                        //读取m_目录下的文件
                        fs.readdir(path2, function(err, files){
                            if(err){console.log(err); return;}

                            files.forEach(function(file){
                                fs.stat(path2 + '/' + file, function(err, stat){
                                    if(err){console.log(err); return;}
                                    if(!stat.isDirectory()) {
                                        var modFile = path2 + '/' + file;
                                        var layoutFileName = path2.split('/m_')[1] + '.html';
                                        cb(layoutFileName, modFile);
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });
    }) (prefix+ '/mods/', function(layoutFileName, modFile) {
        //console.log(layoutFileName + '==' + modFile);
        //支持3层嵌套
        gulp.src(modFile)
            .pipe(contentIncluder({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
             .pipe(contentIncluder({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(contentIncluder({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(rename(layoutFileName))
            .pipe(gulp.dest(prefix+ '/layout/'));
    });
});

gulp.task('layout2', function() {
    console.log(test);
    gulp.src(prefix+ '/mods/m-*/*.html')
        .pipe();
});

//js合并
gulp.task('combineJs', function() {
    gulp.src(path.scripts)
        .pipe(concat('combine.js'))
        .pipe(gulp.dest(prefix+ '/publish/'))
        .pipe(uglify())
        .pipe(rename('combine.min.js'))
        .pipe(gulp.dest(prefix+ '/publish/'));
});

//css合并
gulp.task('combineCss', function() {
    gulp.src(path.css)
        .pipe(concat('combine.css'))
        .pipe(gulp.dest(prefix+ '/publish/'))
        .pipe(minifyCss())
        .pipe(rename('combine.min.css'))
        .pipe(gulp.dest(prefix+ '/publish/'));
});

//css、js 合并
gulp.task('combine', function() {
    gulp.run('combineJs', 'combineCss');
});

//合并库和框架
gulp.task('lib', function() {
    gulp.src([prefix+ '/publish/jquery/*.min.js', prefix+ '/publish/backbone/*.min.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(prefix+ '/publish/'));
});

//触发监听
gulp.task('default', function() {
    gulp.watch(prefix+ '/mods/**/*.js', function() {
        gulp.run('combineJs');
    });
    gulp.watch(prefix+ '/mods/**/*.css', function() {
        gulp.run('combineCss');
    });
    gulp.watch(prefix+ '/mods/**/*.html', function() {
        gulp.run('layout');
    })
});

