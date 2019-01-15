'use strict';

var grunt = require('grunt');
var fs = require('fs');
var process = require('process');
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

exports.package_modules = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  basic: function(test) {
    test.expect(2);

    test.ok(grunt.file.isDir('tmp/basic/dist'), 'dist directory exists');

    var expectedModules = fs.readFileSync('test/expected/basic', 'utf8').split("\n");
    var actualModules = fs.readdirSync('tmp/basic/dist/node_modules').sort();
    test.deepEqual(expectedModules, actualModules, 'bundled node_modules');

    test.done();
  },
};
