var gulp = require('gulp');
var concat = require('gulp-concat');
//var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var contentIncluder = require('gulp-content-includer');
var fs = require('fs');

var prefix = './wd';

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

                                    var modFile = path2 + '/' + file;
                                    var layoutFileName = path2.split('/m_')[1] + '.html';
                                    cb(layoutFileName, modFile);
                                });
                            });
                        });
                    }
                });
            });

        });
    }) (prefix+ '/mods/', function(layoutFileName, modFile) {
        console.log(layoutFileName + '==' + modFile);
        gulp.src(modFile)
            .pipe(contentIncluder({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(rename(layoutFileName))
            .pipe(gulp.dest(prefix+ '/layout/'));
    });
});

gulp.task('default', function() {
    console.log(prefix + '/mods/m_test/def.html');

    gulp.src(prefix + '/mods/m_test/def.html')
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('index2.html'))
        .pipe(gulp.dest(prefix+ '/layout/'));
    console.log(123123);
});