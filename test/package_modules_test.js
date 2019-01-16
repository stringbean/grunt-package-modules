'use strict';

var grunt = require('grunt');
var fs = require('fs');
var process = require('process');

function verifyDistDir(test, name) {
  test.expect(4);

  test.ok(grunt.file.isDir(`tmp/${name}/dist`), 'dist directory exists');

  test.ok(grunt.file.isFile(`tmp/${name}/dist/package.json`), 'package.json copied');
  test.ok(grunt.file.isFile(`tmp/${name}/dist/package-lock.json`), 'package-lock.json copied');

  var expectedModules = fs.readFileSync(`test/expected/${name}`, 'utf8').split("\n");
  var actualModules = fs.readdirSync(`tmp/${name}/dist/node_modules`).sort();
  test.deepEqual(expectedModules, actualModules, 'bundled node_modules');

  test.done();
}

exports.package_modules = {
  basic: function(test) {
    verifyDistDir(test, 'basic');
  },
  'no-src': function(test) {
    verifyDistDir(test, 'no-src');
  },
  'with-lock': function(test) {
    verifyDistDir(test, 'with-lock');
  },
};
