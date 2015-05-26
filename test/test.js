'use strict';
var assert = require('assert');
var fs = require('fs');
var join = require('path').join;
var simplePreprocess = require('../');

it('should work with html', function() {
  var html = fs.readFileSync(join(__dirname, 'fixtures/env.html'), 'utf8');
  var actual = simplePreprocess(html, 'html', 'prod');
  var expectedData = fs.readFileSync(join(__dirname, 'expected/env.html'), 'utf8');
  assert.deepEqual(actual, {
    data: expectedData,
    retained: [
      '<!-- @if prod -->\n<!--<script charset="utf-8">\n  var value = \'prod\';\n</script>-->\n<!-- @endif -->\n\n',
      '<!-- @if test, prod -->\n<!--<script charset="utf-8">\n  var value = \'test and prod\';\n</script>-->\n<!-- @endif -->\n'
    ],
    stripped: [
      '<!-- @if dev -->\n<script charset="utf-8">\n  var value = \'dev\';\n</script>\n<!-- @endif -->\n\n',
      '<!-- @if test -->\n<!--<script charset="utf-8">\n  var value = \'test\';\n</script>\n<!-- @endif -->\n\n'
    ]
  });
});

it('should work with js', function() {
  var js = fs.readFileSync(join(__dirname, 'fixtures/env.js'), 'utf8');
  var actual = simplePreprocess(js, 'js', 'test');
  var expectedData = fs.readFileSync(join(__dirname, 'expected/env.js'), 'utf8');
  assert.deepEqual(actual, {
    data: expectedData,
    retained: [
      '// @if test\n// var value = \'test\';\n// @endif\n\n',
      '/* @if test, prod */\n/*var value = \'test and prod\';*/\n/* @endif */\n'
    ],
    stripped: [
      '// @if dev\nvar value = \'dev\';\n// @endif\n\n',
      '// @if prod\n// var value = \'prod\';\n// @endif\n\n'
    ]
  });
});

it('should work with css', function() {
  var css = fs.readFileSync(join(__dirname, 'fixtures/env.css'), 'utf8');
  var actual = simplePreprocess(css, 'css', ['dev', 'test']);
  var expectedData = fs.readFileSync(join(__dirname, 'expected/env.css'), 'utf8');
  assert.deepEqual(actual, {
    data: expectedData,
    retained: [
      '/* @if dev */\nbody {\n  background: red;\n}\n/* @endif */\n\n',
      '/* @if test*/\n/*body {\n  background: yellow;\n}*/\n/* @endif*/\n\n',
      '/* @if test,prod */\n/*body {\n  background: green;\n} */\n/* @endif */\n'
    ],
    stripped: [
      '/* @if prod */\n/* body {\n  background: blue;\n}*/\n/* @endif */\n\n'
    ]
  });
});

it('should default to process.env.NODE_ENV', function() {
  var css = fs.readFileSync(join(__dirname, 'fixtures/env.css'), 'utf8');
  var actual = simplePreprocess(css, 'css');
  var expectedData = fs.readFileSync(join(__dirname, 'expected/default-env.css'), 'utf8');
  assert.deepEqual(actual, {
    data: expectedData,
    retained: [
      '/* @if test*/\n/*body {\n  background: yellow;\n}*/\n/* @endif*/\n\n',
      '/* @if test,prod */\n/*body {\n  background: green;\n} */\n/* @endif */\n'
    ],
    stripped: [
      '/* @if dev */\nbody {\n  background: red;\n}\n/* @endif */\n\n',
      '/* @if prod */\n/* body {\n  background: blue;\n}*/\n/* @endif */\n\n'
    ]
  });
});
