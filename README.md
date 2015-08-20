# grunt-chicago

> A Grunt plugin to handle JavaScript file imports. Add an `// @import` statement in your project's JavaScript files to inject the content from one file into another.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-chicago --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-chicago');
```

## The "chicago" task

### Overview
In your project's Gruntfile, add a section named `chicago` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  chicago: {
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

_This plugin doesn't accept options_

### Usage Examples

#### Default Usage
To inject or import files in your project, add a line that contains the following:

```js
// @import path/to/import.js
```

Set the source files/directories in your Gruntfile:

```js
grunt.initConfig({
  chicago: {
    files: {
      'src' : [ 
        'src/file.js', 
        'src/directory' 
       ]
    },
  },
});
```

And execute the task in Terminal:

```
grunt chicago
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2015-08-19 - **v1.0.0** - Initial Release
