/*
 * grunt-package-modules
 * https://github.com/joshperry/grunt-package-modules
 *
 * Copyright (c) 2014 Joshua Perry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  const path = require('path');
  const chalk = require('chalk');
  const semver = require('semver');

  function ciSupported(callback, errorCallback) {
    const options = {
      cmd: 'npm',
      args: ['--version']
    };

    grunt.util.spawn(options, function (err, done) {
      if (err) {
        errorCallback();
      } else {
        callback(semver.satisfies(done.toString(), '>=5.7.0'));
      }
    });
  }

  function runNpmCi(dir, done) {
    grunt.verbose.writeln(`Running ${chalk.cyan('npm ci')} in ${chalk.cyan(dir)}`);

    const options = {
      cmd: 'npm',
      args: ['ci', '--production'],
      opts: {
        cwd: dir
      }
    };

    grunt.util.spawn(options, function (err) {
      return done(err);
    });
  }

  function runNpmInstall(dir, done) {
    grunt.verbose.writeln(`Running ${chalk.cyan('npm install')} in ${chalk.cyan(dir)}`);

    const options = {
      cmd: 'npm',
      args: ['install', '--production', '--no-package-lock'],
      opts: {
        cwd: dir
      }
    };

    grunt.util.spawn(options, function (err) {
      return done(err);
    });
  }

  function runYarn(dir, done) {
    grunt.verbose.writeln(`Running ${chalk.cyan('yarn install')} in ${chalk.cyan(dir)}`);

    const options = {
      cmd: 'yarn',
      args: ['install', '--production', '--frozen-lockfile'],
      opts: {
        cwd: dir
      }
    };

    grunt.util.spawn(options, function (err) {
      return done(err);
    });
  }

  function processModules(f, done) {
    function cb(ci) {
      grunt.verbose.writeln(`npm ci supported? ${chalk.cyan(ci)}`);

      let cwd = process.cwd();

      if (f.cwd) {
        cwd = path.resolve(cwd, f.cwd);
      }

      let dest = path.join(cwd, 'dist');

      if (f.dest) {
        dest = path.join(cwd, f.dest);
      }

      grunt.verbose.writeln(`Creating ${chalk.cyan(dest)}`);
      grunt.file.mkdir(dest);

      let packageSrc;
      let useLockfile = false;
      let useYarn = false;

      if (f.src) {
        if (f.src.length !== 1) {
          grunt.fail.fatal(
            `One source package.json should be specified. There were ${f.src.length} source files specified.`);
          return;
        } else if (path.basename(f.src[0]) !== 'package.json') {
          grunt.fail.fatal(
            `One source package.json should be specified. ${f.src[0]} is not a valid package.json file.`);
          return;
        } else {
          packageSrc = path.join(cwd, f.src[0]);
        }
      } else {
        // default to package.json in the cwd
        packageSrc = path.join(cwd, 'package.json');
      }

      if (grunt.file.exists(packageSrc)) {
        const packageDest = path.join(dest, 'package.json');

        grunt.verbose.writeln(`Copying ${chalk.cyan(packageSrc)} -> ${chalk.cyan(packageDest)}`);
        grunt.file.copy(packageSrc, packageDest);

        const yarnLockSrc = path.join(cwd, 'yarn.lock');
        const lockSrc = path.join(cwd, 'package-lock.json');

        if (grunt.file.exists(yarnLockSrc)) {
          useYarn = true;
          const lockDest = path.join(dest, 'yarn.lock');
          grunt.verbose.writeln(`Copying ${chalk.cyan(yarnLockSrc)} -> ${chalk.cyan(lockDest)}`);
          grunt.file.copy(yarnLockSrc, lockDest);
        } else if (grunt.file.exists(lockSrc)) {
          useLockfile = true;
          const lockDest = path.join(dest, 'package-lock.json');
          grunt.verbose.writeln(`Copying ${chalk.cyan(lockSrc)} -> ${chalk.cyan(lockDest)}`);
          grunt.file.copy(lockSrc, lockDest);
        }

      } else {
        grunt.fail.fatal(`The package.json file specified does not exist at ${packageSrc}`);
        return;
      }

      if (useYarn) {
        runYarn(dest, done);
      } else if (ci && useLockfile) {
        runNpmCi(dest, done);
      } else {
        runNpmInstall(dest, done);
      }
    }

    ciSupported(cb, function () {
      grunt.fail.fatal('Error while checking npm version');
      done(false);
    });
  }

  grunt.registerMultiTask('packageModules', 'Bundle node_modules for distribution', function () {
    if (this.files.length) {
      this.files.forEach(function (f) {
        processModules(f, this.async());
      }.bind(this));
    } else {
      processModules(this.data, this.async());
    }
  });
};