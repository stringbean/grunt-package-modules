/*
 * grunt-package-modules
 * https://github.com/joshperry/grunt-package-modules
 *
 * Copyright (c) 2014 Joshua Perry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var chalk = require('chalk');
  var semver = require('semver');

  function ciSupported(callback, errorCallback) {
    var options = {
      cmd: 'npm',
      args: ['--version']
    }

    grunt.util.spawn(options, function(err, done) {
      if (err) {
        errorCallback()
      } else {
        callback(semver.satisfies(done.toString(), '>=5.7.0'));
      }
    });
  }

  function processModules(f, done) {
    function cb(ci) {
      grunt.verbose.writeln('npm ci supported? ' + chalk.cyan(ci));

      var cwd = process.cwd();

      if (f.cwd) {
        cwd = path.resolve(cwd, f.cwd);
      }

      var dest = path.join(cwd, 'dist');

      if (f.dest) {
        dest = path.join(cwd, f.dest);
      }

      grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
      grunt.file.mkdir(dest);

      var packageSrc;
      var lockSrc;
      var useLockfile = false;

      if (f.src) {
        if (f.src.length !== 1) {
          grunt.fail.fatal('One source package.json should be specified. There were ' + f.src.length + ' source files specified.');
          return;
        } else if (path.basename(f.src[0]) !== 'package.json') {
          grunt.fail.fatal('One source package.json should be specified. ' + f.src[0] + ' is not a valid package.json file.');
          return;
        } else {
          packageSrc = path.join(cwd, f.src[0]);
        }
      } else {
        // default to package.json in the cwd
        packageSrc = path.join(cwd, 'package.json');
      }

      if (grunt.file.exists(packageSrc)) {
        var packageDest = path.join(dest, 'package.json');

        grunt.verbose.writeln('Copying ' + chalk.cyan(packageSrc) + ' -> ' + chalk.cyan(packageDest));
        grunt.file.copy(packageSrc, packageDest);

        var lockSrc = path.join(cwd, 'package-lock.json');

        if (grunt.file.exists(lockSrc)) {
          useLockfile = true;
          var lockDest = path.join(dest, 'package-lock.json');
          grunt.verbose.writeln('Copying ' + chalk.cyan(lockSrc) + ' -> ' + chalk.cyan(lockDest));
          grunt.file.copy(lockSrc, lockDest);
        }

      } else {
        grunt.fail.fatal('The package.json file specified does not exist at ' + packageSrc);
        return;
      }

      if (ci && useLockfile) {
        grunt.verbose.writeln('Running ' + chalk.cyan('npm ci') + ' in ' + chalk.cyan(dest));

        var options = {
          cmd: 'npm',
          args: ['ci'],
          opts: {
            cwd: dest
          }
        }

        grunt.util.spawn(options, function(err) {
          return done(err);
        });
      } else {
        grunt.verbose.writeln('Running ' + chalk.cyan('npm install') + ' in ' + chalk.cyan(dest));

        var npmArgs = ['install', '--production', '--no-package-lock'];

        var options = {
          cmd: 'npm',
          args: npmArgs,
          opts: {
            cwd: dest
          }
        }

        grunt.util.spawn(options, function(err) {
          return done(err);
        });
      }
    }

    ciSupported(cb, function() {
      grunt.fail.fatal('Error while checking npm version');
      done(false);
    });
  }

  grunt.registerMultiTask('packageModules', 'Packages node_modules dependencies at build time for addition to a distribution package.', function() {
    if (this.files.length) {
      this.files.forEach(function(f) {
        processModules(f, this.async());
      }.bind(this));
    } else {
      processModules(this.data, this.async());
    }
  });
};