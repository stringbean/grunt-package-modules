/*
 * grunt-package-modules
 * https://github.com/joshperry/grunt-package-modules
 *
 * Copyright (c) 2014 Joshua Perry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      tests: ['tmp']
    },

    copy: {
      fixtures: {
        src: '**',
        cwd: 'test/fixtures',
        dest: 'tmp/',
        expand: true
      }
    },

    // test projects to bundle
    packageModules: {
      basic: {
        cwd: 'tmp/basic',
        src: 'package.json',
        dest: 'dist'
      },
      'no-src': {
        cwd: 'tmp/no-src'
      },
      'with-lock': {
        cwd: 'tmp/with-lock',
        src: 'package.json',
        dest: 'dist'
      },
      yarn: {
        cwd: 'tmp/yarn'
      },
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    eslint: {
      target: [
        'tasks/*.js',
        'Gruntfile.js',
        'test/*.js',
        'Gruntfile.js'
      ]
    }
  });

  // load our tasks
  grunt.loadTasks('tasks');

  // load other tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-eslint');

  // create a fresh set of test data, run our tasks & verify output
  grunt.registerTask('test', ['clean', 'copy', 'packageModules', 'nodeunit']);

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('default', ['test', 'lint']);
};
