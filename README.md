#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Preprocess html, js and css based off environment configuration


Originally based on [preprocess](https://github.com/jsoverson/preprocess). Created this because I only want to do simpler things with simpler config.


## Install

```sh
$ npm install --save simple-preprocess
```


## Usage

```js
var simplePreprocess = require('simple-preprocess');

simplePreprocess('/* @if dev */\nbody {\nbackground: red;\n}\n/* @endif */\n/* @if test*/\n/*body {\nbackground: yellow;\n}*/\n/* @endif*/', 'js', 'dev');
/*=> {
  data: 'body {\nbackground: red;\n}\n',
  retained: ['/* @if dev *\/\nbody {\nbackground: red;\n}\n/* @endif *\/\n'],
  stripped: ['/* @if test*\/\n/*body {\nbackground: yellow;\n}*\/\n/* @endif*\/']
} */
```

```sh
$ npm install --global simple-preprocess
$ simple-preprocess --help

  Usage
    simple-preprocess <input-path> <type>
    simple-preprocess <input-path> <type> <output-path>
    cat <input-path> | simple-preprocess <type>

  Example
    simple-preprocess env.css css -c 'prod,dev'
    simple-preprocess env.html html env.html
    cat env.css | simple-preprocess css -c test
    cat env.js | simple-preprocess js -c dev > processed.js

  Options
    -e, --env        Environment
    -v, --verbose    Verbose output
```


## API

### simplePreprocess(data, type, [env])

#### data

Type `string`

#### type

Type `string`

Posible values: `'html'`, `'js'` and `'css'`

#### env

Type `string` or `array`

Default: `process.env.NODE_ENV`


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/simple-preprocess.svg
[npm-url]: https://npmjs.org/package/simple-preprocess
[travis-image]: https://travis-ci.org/stevemao/simple-preprocess.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/simple-preprocess
[daviddm-image]: https://david-dm.org/stevemao/simple-preprocess.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/simple-preprocess
[coveralls-image]: https://coveralls.io/repos/stevemao/simple-preprocess/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/simple-preprocess
