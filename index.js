'use strict';
var regex = require('./lib/regex-rules');
var uncommentIt = require('uncomment-it');

module.exports = function(data, type, env) {
  var retained = [];
  var stripped = [];

  data = String(data);
  env = env || process.env.NODE_ENV;

  if (!Array.isArray(env)) {
    env = env.split(',');
  }

  data = data.replace(regex[type], function(match, tests, include) {
    var isRetained = false;
    tests = tests.split(',');

    tests.forEach(function(test) {
      test = test.trim();
      if (env.indexOf(test) !== -1) {
        isRetained = true;
      }
    });

    if (isRetained) {
      retained.push(match);
      include = uncommentIt(include, type).data;
    } else {
      stripped.push(match);
      include = '';
    }

    return include;
  });

  return {
    data: data,
    retained: retained,
    stripped: stripped
  };
};
