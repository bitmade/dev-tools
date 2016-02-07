const timesFn = function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
};

const forFn = function(from, to, incr, block) {
  var accum = '';
  for(var i = from; i < to; i += incr)
    accum += block.fn(i);
  return accum;
};

export default {
  'times': timesFn,
  'for': forFn,
};