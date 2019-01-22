'use strict';

const grunt = require('grunt');
const fs = require('fs');

function verifyDistDir(test, name, lockfile) {
  test.expect(4);

  test.ok(grunt.file.isDir(`tmp/${name}/dist`), 'dist directory exists');

  test.ok(grunt.file.isFile(`tmp/${name}/dist/package.json`), 'package.json copied');
  test.equal(grunt.file.isFile(`tmp/${name}/dist/package-lock.json`), lockfile, 'package-lock.json copied');

  const expectedModules = fs.readFileSync(`test/expected/${name}`, 'utf8').split('\n');
  const actualModules = fs.readdirSync(`tmp/${name}/dist/node_modules`).sort();
  test.deepEqual(actualModules, expectedModules, 'bundled node_modules');

  test.done();
}

exports.package_modules = {
  basic: function(test) {
    verifyDistDir(test, 'basic', false);
  },
  'no-src': function(test) {
    verifyDistDir(test, 'no-src', false);
  },
  'with-lock': function(test) {
    verifyDistDir(test, 'with-lock', true);
  },
  yarn: function(test) {
    verifyDistDir(test, 'yarn', false);
  },
};
