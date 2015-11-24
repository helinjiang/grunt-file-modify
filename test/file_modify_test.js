'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.file_modify = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    options_process: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/options_process.js');
        var expected = grunt.file.read('test/expected/options_process.js');
        test.equal(actual, expected, '@debug line should be removed!');

        test.done();
    },
    options_reg: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/options_reg.js');
        var expected = grunt.file.read('test/expected/options_reg.js');
        test.equal(actual, expected, 'some text should be replaced');

        test.done();
    }
};
