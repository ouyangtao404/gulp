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
    js : [prefix+ '/mods/unitaryConfig/assets/*.js', prefix+ '/mods/{m_*,p_*}/assets/*.js'],
    css: [prefix+ '/mods/unitaryConfig/assets/*.css', prefix+ '/mods/{m_*,p_*}/assets/*.css']
};

//只在共用模块发送变化的时候启动（p_）
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

//js合并
gulp.task('combineJs', function() {
    gulp.src(paths.js)
        .pipe(concat('combine.js'))
        .pipe(gulp.dest(prefix+ '/publish/'))
        .pipe(uglify())
        .pipe(rename('combine.min.js'))
        .pipe(gulp.dest(prefix+ '/publish/'));
});

//css合并
gulp.task('combineCss', function() {
    gulp.src(paths.css)
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
    gulp.run('layout');

    gulp.run('combineJs');
    gulp.watch(prefix+ '/mods/**/*.js', function() {
        gulp.run('combineJs');
    });

    gulp.run('combineCss');
    gulp.watch(prefix+ '/mods/**/*.css', function() {
        gulp.run('combineCss');
    });

    //监听m_模块
    gulp.watch(prefix+ '/mods/m_*/*.html', function(e) {
        var filePath = e.path.replace(/\\/g, '/');//把D:\XXX\YYY  转为  D:/XXX/YYY
        var layoutFileName = filePath.split('/m_')[1].split('/')[0] + '.html';
        gulp.src(filePath)
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

    //监听p_模块
    gulp.watch(prefix+ '/mods/p_*/*.html', function(e) {
        gulp.run('layout');
    });

});

