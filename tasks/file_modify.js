/*
 * grunt-file-modify
 * https://github.com/helinjiang/grunt-file-modify
 *
 * Copyright (c) 2015 helinjiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('file_modify', 'modify file content.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            process: function (content, srcpath) {
                return content;
            } // 处理文件的内容，Type: Function(content, srcpath)
        });
        this.filesSrc.forEach(function (filepath) {
            grunt.file.copy(filepath, filepath, {
                process: options.process
            })
            console.log(filepath);
        });
    });

};
