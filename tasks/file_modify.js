/*
 * grunt-file-modify
 * https://github.com/helinjiang/grunt-file-modify
 *
 * Copyright (c) 2015 helinjiang
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('file_modify', 'modify file content.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            reg: null, // 对象，{pattern:xxx,attributes:zzz,replaceStr:yyy},用于正则匹配并替换文件内容
            process: null // 处理文件的内容，Type: Function(content, srcpath)
        });

        // 如果没有在options进行配置，则这些文件将不进行任何处理
        if (!options.reg && !options.process) {
            grunt.log.warn('No valid config in options, do nothing in task "' + this.target + '" for: ' + this.filesSrc);
            return;
        }

        //==========================================================
        // 执行顺序：首先处理reg的内容，再处理process
        //==========================================================

        /**
         * 处理options.reg配置
         */
        var optionsRegFunc;
        if (options.reg && options.reg.pattern && options.reg.replaceStr) {
            var attributes = options.reg.attributes || 'gi';
            optionsRegFunc = function (content, srcpath) {
                return content.replace(new RegExp(options.reg.pattern, attributes), options.reg.replaceStr);
            };
        }

        /**
         * 最终的process函数
         * @param {String} content 文件内容
         * @param {String} srcpath 文件路径
         * @returns {String}
         */
        var processFunc = function (content, srcpath) {
            var newContent = content;
            if (_.isFunction(optionsRegFunc)) {
                newContent = optionsRegFunc(newContent, srcpath);
            }

            if (_.isFunction(options.process)) {
                newContent = options.process(newContent, srcpath);
            }

            return newContent;
        };

        this.filesSrc.forEach(function (filepath) {
            grunt.log.write('Modify: ' + filepath + '...');

            grunt.file.copy(filepath, filepath, {
                process: processFunc
            });

            // 如果成功，则打印OK
            grunt.log.ok();
        });
    });

};
