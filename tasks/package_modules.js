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
  var npm = require('npm');
  var chalk = require('chalk');


  grunt.registerMultiTask('packageModules', 'Packages node_modules dependencies at build time for addition to a distribution package.', function() {

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var cwd = process.cwd();

      if (f.cwd) {
        cwd = path.resolve(cwd, f.cwd);
      }

      var dest = path.join(cwd, f.dest);
      grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
      grunt.file.mkdir(dest);




      // Verify that package.json exists and copy it to the target dir
      if(f.src.length === 1) {
        var packageSrc = path.join(cwd, f.src[0]);

        if(grunt.file.exists(packageSrc)) {
          var packageDest = path.join(dest, path.basename(f.src[0]));

          grunt.verbose.writeln('Copying ' + chalk.cyan(f.src[0]) + ' -> ' + chalk.cyan(packageDest));
          grunt.file.copy(packageSrc, packageDest);
        } else {
          grunt.fail.fatal('The package.json file specified does not exist at ' + packageSrc);
          return false;
        }
      } else {
        grunt.fail.fatal('One source package.json should be specified. There were ' + f.src.length + ' source files specified.');
        return false;
      }

      // Pull the npm dependencies into the bundle directory
      npm.on('log', function(msg) {
        grunt.verbose.writeln(msg);
      });

      grunt.verbose.writeln('Running ' + chalk.cyan('npm install') + ' in ' + chalk.cyan(dest));

      var done = this.async();

      npm.load({
        production: true,
        "ignore-scripts": !!f.ignoreScripts,
        prefix: dest
      }, function(err) {
        if(err) {
          grunt.fail.fatal(err);
        }

        npm.commands.install([], function(err) {
          if(err) {
            grunt.fail.fatal(err);
          }

          done();
        });
      });

    }.bind(this));

  });

};
