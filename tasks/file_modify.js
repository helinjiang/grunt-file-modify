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
            template: null, // 对象，{data:xxx, type:yyy}
            reg: null, // 对象，{pattern:xxx, flags:zzz, replaceStr:yyy},用于正则匹配并替换文件内容
            process: null // 处理文件的内容，Type: Function(content, srcpath)
        });

        // 如果没有在options进行配置，则这些文件将不进行任何处理
        if (!options.template && !options.reg && !options.process) {
            grunt.log.warn('No valid config in options, do nothing in task "' + this.target + '" for: ' + this.filesSrc);
            return;
        }

        //==========================================================
        // 执行顺序：首先处理template内容，然后reg的内容，再处理process
        //==========================================================
        /**
         * 处理options.template配置
         */
        var optionsTemplateFunc;
        if (options.template && options.template.data) {
            var dataJson;
            if (_.isObject(options.template.data)) {
                dataJson = options.template.data;
            } else {
                dataJson = grunt.file.readJSON(options.template.data);
                if (!_.isObject(dataJson) || _.isEmpty(dataJson)) {
                    grunt.log.warn('Can not get JSON in task "' + this.target + '" from ' + options.template.data);
                    return false;
                }
            }

            optionsTemplateFunc = function (content, srcpath) {
                return _.template(content)(dataJson);
            };
        }

        /**
         * 处理options.reg配置
         */
        var optionsRegFunc;
        if (options.reg && options.reg.pattern) {
            var flags = options.reg.flags || 'gi',
                replaceStr = options.reg.replaceStr || '';

            optionsRegFunc = function (content, srcpath) {
                return content.replace(new RegExp(options.reg.pattern, flags), replaceStr);
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

            if (_.isFunction(optionsTemplateFunc)) {
                newContent = optionsTemplateFunc(newContent, srcpath);
            }

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
