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

  grunt.registerMultiTask('packageModules', 'Packages node_modules dependencies at build time for addition to a distribution package.', function() {

    function processModules(f, done) {
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

      if (f.src) {
        if (f.src.length === 1) {
          packageSrc = path.join(cwd, f.src[0]);
        } else {
          grunt.fail.fatal('One source package.json should be specified. There were ' + f.src.length + ' source files specified.');
          return;
        }
      } else {
        packageSrc = path.join(cwd, 'package.json');
      }

      if (grunt.file.exists(packageSrc)) {
        var packageDest = path.join(dest, path.basename(packageSrc));

        grunt.verbose.writeln('Copying ' + chalk.cyan(packageSrc) + ' -> ' + chalk.cyan(packageDest));
        grunt.file.copy(packageSrc, packageDest);
      } else {
        grunt.fail.fatal('The package.json file specified does not exist at ' + packageSrc);
        return;
      }

      grunt.verbose.writeln('Running ' + chalk.cyan('npm install') + ' in ' + chalk.cyan(dest));

      var npmArgs = ['install', '--production'];

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

    if (this.files.length) {
      this.files.forEach(function(f) {
        processModules(f, this.async());
      }.bind(this));
    } else {
      processModules(this.data, this.async());
    }
  });
};