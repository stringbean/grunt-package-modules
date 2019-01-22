# grunt-package-modules [![CircleCI](https://circleci.com/gh/stringbean/grunt-package-modules/tree/master.svg?style=shield)](https://circleci.com/gh/stringbean/grunt-package-modules/tree/master) [![Requirements Status](https://requires.io/github/stringbean/grunt-package-modules/requirements.svg?branch=master)](https://requires.io/github/stringbean/grunt-package-modules/requirements/?branch=master)

> Package node_modules dependencies for bundling with a distribution package.



Checking `node_modules` in to source control is a lame solution to locking dependencies for a certain commit.
[npm shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) is great for locking dependencies to specific commits but doesn't directly help with distribution packaging.

The `node_modules` folder that is used for building your project is not viable for dist packaging because it will contain dev dependencies (like this grunt plugin) and can also contain host-specific binary node modules.

This task takes care of creating a fresh `node_modules` for including in a distribution tarball by effectively copying the `package.json` into a temp directory, and then executing `npm install --production --ignore-scripts --prefix tempdir/` to install all production deps into `tmpdir/node_modules`.

This directory can then be the source of another plugin, like copy or compress, to package the fresh `node_modules` into its delicious-looking retail packaging.

This is a great module to use with the concurrent plugin so that the node modules will download while other parts of your packaging flow are executing (sassing, lessing, uglifying, compiling, and other transformation plugins verbified).

## Getting Started

This plugin requires Grunt 0.4.5 or newer.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install @string-bean/grunt-package-modules --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('@string-bean/grunt-package-modules');
```

## The "packageModules" task

### Overview

In your project's Gruntfile, add a section named `packageModules` to the data object passed into `grunt.initConfig()`:

```js
grunt.initConfig({
  packageModules: {
    dist: {}
  }
});
```

If your `package.json` is not in the current directory you can add `cwd` to the config:

```js
grunt.initConfig({
  packageModules: {
    dist: {
      cwd: 'sub-dir'
    }
  }
});
```

If a valid `package-lock.json` and `npm` 5.7.0 or higher is available, `grunt-package-modules` will use `npm ci` to
generate the modules - improving reproducibility and speed.

If a valid `yarn.lock` is found then `grunt-package-modules` will use `yarn install` to generate the modules.

### Example Build

Here is an example that uses the copy and compress plugins to send the packaged modules to a dist tarball:

```js
module.exports = function(grunt) {
  grunt.initConfig({
    packageModules: {
      dist: {}
    },
    copy: {
      dist: {
        files: [{
      // copy our source files to the distribution
          expand: true,
          dest: 'dist',
          src: [
            'lib/**/*'
          ]
        }]
      },
    },
    // tarball all the files in the dist dir into proj-dist.tar.gz
    compress: {
      dist: {
        options: {
        archive: 'dist/proj-dist.tar.gz'
      },
      files: [{
        expand: true,
      dot: true,
      cwd: 'dist',
          src: '**/*'
        }]
      }
    },
  });
  
  grunt.registerTask('dist', ['packageModules', 'copy', 'compress']);
}
```

## License

Original work copyright (c) 2014 Joshua Perry

Additions copyright (c) 2019 Michael Stringer

Licensed under the MIT License