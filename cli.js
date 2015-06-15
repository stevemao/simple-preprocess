#!/usr/bin/env node
'use strict';
var chalk = require('chalk');
var concat = require('concat-stream');
var fs = require('fs');
var meow = require('meow');
var simplePreprocess = require('./');

var cli = meow({
  help: [
    'Usage',
    '  simple-preprocess <input-path> <type>',
    '  simple-preprocess <input-path> <type> <output-path>',
    '  cat <input-path> | simple-preprocess <type>',
    '',
    'Example',
    '  simple-preprocess env.css css -c \'prod,dev\'',
    '  simple-preprocess env.html html env.html',
    '  cat env.css | simple-preprocess css -c test',
    '  cat env.js | simple-preprocess js -c dev > processed.js',
    '',
    'Options',
    '  -e, --env        Environment',
    '  -v, --verbose    Verbose output'
  ].join('\n')
}, {
  alias: {
    c: 'env',
    v: 'verbose'
  }
});

var input = cli.input;
var inputPath = input[0];
var type = input[1];
var outputPath = input[2];
var flags = cli.flags;
var env = flags.env;
var verbose = flags.verbose;

function extraInfo(retained, stripped) {
  if (!verbose) {
    return;
  }

  console.log('');

  var retainedCount = retained.length;
  var strippedCount = stripped.length;

  if (retainedCount > 0 || strippedCount > 0) {
    retained.forEach(function(code) {
      console.log(chalk.green(code) + chalk.cyan('retained'));
    });

    stripped.forEach(function(code) {
      console.log(chalk.red(code) + chalk.magenta('stripped'));
    });

    console.log(chalk.green('✔ ') + retainedCount + ' blocks retained.');
    console.log(chalk.red('✖ ') + strippedCount + ' blocks stripped.');
  }
}

if (process.stdin.isTTY) {
  if (!inputPath) {
    console.error('Expected an input path');
    process.exit(1);
  }

  fs.readFile(inputPath, function(err, data) {
    if (err) {
      console.error(err.toString());
      process.exit(1);
    }

    var result = simplePreprocess(data, type, env);

    if (outputPath) {
      fs.writeFile(outputPath, result.data, function(err) {
        if (err) {
          console.error(err.toString());
          process.exit(1);
        }
      });
    } else {
      process.stdout.write(result.data);
    }

    extraInfo(result.retained, result.stripped);
  });
} else {
  type = inputPath;

  process.stdin
    .pipe(concat(function(data) {
      var result = simplePreprocess(data, type, env);
      process.stdout.write(result.data);
      extraInfo(result.retained, result.stripped);
    }));
}
