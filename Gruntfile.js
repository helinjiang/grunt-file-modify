/*
 * grunt-file-modify
 * https://github.com/helinjiang/grunt-file-modify
 *
 * Copyright (c) 2015 helinjiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        testVar: 'tmp',
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // copy  to tmp
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'test/fixtures/',
                    src: ['**/*'],
                    dest: 'tmp/'
                }]
            }
        },

        // Configuration to be run (and then tested).
        file_modify: {
            options_process: {
                options: {
                    process: function (content, srcpath) {
                        /**
                         * 去掉包含了 “//@debug” 的行的内容，例如下面这一行因为包含了@debug，则该行内容将被替换为空白
                         * console.log(s1); // @debug remove this line, too!
                         */
                        return content.replace(/[^\n]+\/\/\s*@\s*debug.*/g, '');
                    }
                },
                src: ['tmp/options_process.js']
            },
            options_reg: {
                options: {
                    reg: {
                        pattern: 'world',
                        flags: 'gi', //可以省略，默认值为'gi'
                        replaceStr: 'grunt-file-modify'
                    },
                    process: function (content, srcpath) {
                        return content.replace(/Node\.js/g, 'grunt-file-modify');
                    }
                },
                src: ['tmp/options_reg.js']
            },
            options_template_data: {
                options: {
                    template: {
                        data: {
                            listName: 'student',
                            detail: [{
                                name: 'LiLei',
                                sex: 'male',
                                age: 15
                            }, {
                                name: 'HanMeimei',
                                sex: 'female',
                                age: 15
                            }, {
                                name: 'Jim',
                                sex: 'male',
                                age: 16
                            }]
                        }
                    }
                },
                src: ['tmp/options_template_data.html']
            },
            options_template_url: {
                options: {
                    template: {
                        data: '<%=testVar%>/data.json'
                    }
                },
                src: ['tmp/options_template_url.html']
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'file_modify', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('mytest', ['clean', 'copy', 'file_modify:options_reg']);

};
