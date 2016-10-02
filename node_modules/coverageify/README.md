# Coverageify
*[Browserify](http://browserify.org/) transform for unit test code coverage, using [Istanbul](https://github.com/gotwarlost/istanbul).*

## Overview

Using coverageify will allow you to know how percentage of code you are covering with your unit tests. Coverageify is 
user with [Karma](https://github.com/karma-runner/karma) & [Karma Coverage](https://github.com/karma-runner/karma-coverage). 
With the right configuration of your `karma.conf.js` file you'll be able to get a full report of your code coverage.

## Installation

With [npm](http://npmjs.org) do:

```
npm install --save-dev coverageify
```

## Usage

Here is a raw example of how to use Coverageify with Karma and how to avoid trash data on your reports

```javascript

module.exports = function(config) {
    config.set({
        
        files: [...],

        frameworks: ['browserify', ... ],

        browserify: {
            transform: [ ... , ['coverageify', {ignores: new RegExp(__dirname)}], ... ]
        },

        browsers : [...],

        reporters: [ ..., 'coverage'],

        preprocessors: {
            '...': ['browserify']
        },

        coverageReporter : {...},

    });
};

```

First of all you'll need to set the ignores attribute on the configuration object of coverageify to only get the right 
coverage, if not you'll get some trash values. 

Then you'll need to use the coverage reporter for [Karma](https://github.com/karma-runner/karma) provided by [Karma Coverage](https://github.com/karma-runner/karma-coverage).

Finally use browserify to preprocess your files.

Al the configuration that do not appears here is because is not really needed, the full configuration example is provided by
[Karma](https://github.com/karma-runner/karma) and [Karma Coverage](https://github.com/karma-runner/karma-coverage).

## Configuration

The configuration object handled by Coverageify could contain the following attributes:

-   **ignores:** An array of file name patters that should be ignored by the reporter when the process is ongoing. We recomend
    to ignore all your mock, tests, and other files that should not be covered.
    
-   **contains:** An array of file name patters that must be contained on the file name when the process is ongoing. This is used
    in case you desire to filter the coverage.

As example here is a config file: 

```javascript
var config = {
    ignores: new RegExp(__dirname)
};
```

-   **To ignore files (that should not be covered) required by covered files you should add a comment with the following content `ignored by test coverage`

## Recommendations

-   As seen is not needed to put `'coverage'` to the preprocessors array list, if that is done we have noticed some issues with trash data. 

## Known issues

-   After trying some use cases, I've founded that for Windows you should ignore all the files with the `__dirname` on it, using the ignores option
    providing the next value `new RegExp(__dirname)` and for Linux you should only use the files that contains `__dirname` so you should use the contains
    option with the same value. Any other suggestions or problem with it let me know.

## Credits

*This project was inspired by [istanbulify](https://github.com/fdecampredon/istanbulify), developed by François de Campredon* 