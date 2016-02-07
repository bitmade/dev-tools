'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var timesFn = function timesFn(n, block) {
  var accum = '';
  for (var i = 0; i < n; ++i) {
    accum += block.fn(i);
  }return accum;
};

var forFn = function forFn(from, to, incr, block) {
  var accum = '';
  for (var i = from; i < to; i += incr) {
    accum += block.fn(i);
  }return accum;
};

exports.default = {
  'times': timesFn,
  'for': forFn
};