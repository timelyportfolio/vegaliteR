(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
  factory((global.d3_time = {}));
}(this, function (exports) { 'use strict';

  var t0 = new Date;
  var t1 = new Date;
  function newInterval(floori, offseti, count) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    return interval;
  };

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  });

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  });

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  });

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  });

  var milliseconds = millisecond.range;
  var seconds = second.range;
  var minutes = minute.range;
  var hours = hour.range;
  var days = day.range;
  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;
  var weeks = sunday.range;
  var months = month.range;
  var years = year.range;

  var utcMillisecond = millisecond;
  var utcMilliseconds = milliseconds;
  var utcSeconds = utcSecond.range;
  var utcMinutes = utcMinute.range;
  var utcHours = utcHour.range;
  var utcDays = utcDay.range;
  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;
  var utcWeeks = utcSunday.range;
  var utcMonths = utcMonth.range;
  var utcYears = utcYear.range;

  var version = "0.0.7";

  exports.version = version;
  exports.milliseconds = milliseconds;
  exports.seconds = seconds;
  exports.minutes = minutes;
  exports.hours = hours;
  exports.days = days;
  exports.sundays = sundays;
  exports.mondays = mondays;
  exports.tuesdays = tuesdays;
  exports.wednesdays = wednesdays;
  exports.thursdays = thursdays;
  exports.fridays = fridays;
  exports.saturdays = saturdays;
  exports.weeks = weeks;
  exports.months = months;
  exports.years = years;
  exports.utcMillisecond = utcMillisecond;
  exports.utcMilliseconds = utcMilliseconds;
  exports.utcSeconds = utcSeconds;
  exports.utcMinutes = utcMinutes;
  exports.utcHours = utcHours;
  exports.utcDays = utcDays;
  exports.utcSundays = utcSundays;
  exports.utcMondays = utcMondays;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursdays = utcThursdays;
  exports.utcFridays = utcFridays;
  exports.utcSaturdays = utcSaturdays;
  exports.utcWeeks = utcWeeks;
  exports.utcMonths = utcMonths;
  exports.utcYears = utcYears;
  exports.millisecond = millisecond;
  exports.second = second;
  exports.minute = minute;
  exports.hour = hour;
  exports.day = day;
  exports.sunday = sunday;
  exports.monday = monday;
  exports.tuesday = tuesday;
  exports.wednesday = wednesday;
  exports.thursday = thursday;
  exports.friday = friday;
  exports.saturday = saturday;
  exports.week = sunday;
  exports.month = month;
  exports.year = year;
  exports.utcSecond = utcSecond;
  exports.utcMinute = utcMinute;
  exports.utcHour = utcHour;
  exports.utcDay = utcDay;
  exports.utcSunday = utcSunday;
  exports.utcMonday = utcMonday;
  exports.utcTuesday = utcTuesday;
  exports.utcWednesday = utcWednesday;
  exports.utcThursday = utcThursday;
  exports.utcFriday = utcFriday;
  exports.utcSaturday = utcSaturday;
  exports.utcWeek = utcSunday;
  exports.utcMonth = utcMonth;
  exports.utcYear = utcYear;
  exports.interval = newInterval;

}));
},{}],3:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

function bins(opt) {
  if (!opt) { throw Error("Missing binning options."); }

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, level, minstep, precision, v, i, eps;

  if (opt.step) {
    // if step size is explicitly given, use that
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
      opt.steps.length - 1,
      bisect(opt.steps, span/maxb, 0, opt.steps.length)
    )];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = opt.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );

    // increase step size if too many bins
    do { step *= base; } while (Math.ceil(span/step) > maxb);

    // decrease step size if allowed
    for (i=0; i<div.length; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop:  max,
    step:  step,
    unit:  {precision: precision},
    value: value,
    index: index
  };
}

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
}

function date_index(v) {
  return index.call(this, this.unit.unit(v));
}

bins.date = function(opt) {
  if (!opt) { throw Error("Missing date binning options."); }

  // find time step, then bin
  var units = opt.utc ? time.utc : time,
      dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin),
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      spec = bins({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  spec.unit = unit;
  spec.index = date_index;
  if (!opt.raw) spec.value = date_value;
  return spec;
};

module.exports = bins;

},{"../time":7,"../util":8}],4:[function(require,module,exports){
var gen = module.exports = {};

gen.repeat = function(val, n) {
  var a = Array(n), i;
  for (i=0; i<n; ++i) a[i] = val;
  return a;
};

gen.zeros = function(n) {
  return gen.repeat(0, n);
};

gen.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

gen.random = {};

gen.random.uniform = function(min, max) {
  if (max === undefined) {
    max = min === undefined ? 1 : min;
    min = 0;
  }
  var d = max - min;
  var f = function() {
    return min + d * Math.random();
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};

gen.random.integer = function(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  var d = b - a;
  var f = function() {
    return a + Math.floor(d * Math.random());
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};

gen.random.normal = function(mean, stdev) {
  mean = mean || 0;
  stdev = stdev || 1;
  var next;
  var f = function() {
    var x = 0, y = 0, rds, c;
    if (next !== undefined) {
      x = next;
      next = undefined;
      return x;
    }
    do {
      x = Math.random()*2-1;
      y = Math.random()*2-1;
      rds = x*x + y*y;
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
    next = mean + y*c*stdev;
    return mean + x*c*stdev;
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};

},{}],5:[function(require,module,exports){
var util = require('../util');

var TYPES = '__types__';

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  function(x) { return x==='' ? null : x; }
};

var TESTS = {
  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
  date: function(x) { return !isNaN(Date.parse(x)); }
};

function annotation(data, types) {
  if (!types) return data && data[TYPES] || null;
  data[TYPES] = types;
}

function type(values, f) {
  values = util.array(values);
  f = util.$(f);
  var v, i, n;

  // if data array has type annotations, use them
  if (values[TYPES]) {
    v = f(values[TYPES]);
    if (util.isString(v)) return v;
  }

  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
    v = f ? f(values[i]) : values[i];
  }

  return util.isDate(v) ? 'date' :
    util.isNumber(v)    ? 'number' :
    util.isBoolean(v)   ? 'boolean' :
    util.isString(v)    ? 'string' : null;
}

function typeAll(data, fields) {
  if (!data.length) return;
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    return (types[f] = type(data, f), types);
  }, {});
}

function infer(values, f) {
  values = util.array(values);
  f = util.$(f);
  var i, j, v;

  // types to test for, in precedence order
  var types = ['boolean', 'integer', 'number', 'date'];

  for (i=0; i<values.length; ++i) {
    // get next value to test
    v = f ? f(values[i]) : values[i];
    // test value against remaining types
    for (j=0; j<types.length; ++j) {
      if (util.isValid(v) && !TESTS[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    // if no types left, return 'string'
    if (types.length === 0) return 'string';
  }

  return types[0];
}

function inferAll(data, fields) {
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    types[f] = infer(data, f);
    return types;
  }, {});
}

type.annotation = annotation;
type.all = typeAll;
type.infer = infer;
type.inferAll = inferAll;
type.parsers = PARSERS;
module.exports = type;

},{"../util":8}],6:[function(require,module,exports){
var util = require('./util');
var type = require('./import/type');
var gen = require('./generate');
var stats = {};

// Collect unique values.
// Output: an array of unique values, in first-observed order
stats.unique = function(values, f, results) {
  f = util.$(f);
  results = results || [];
  var u = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    results.push(v);
  }
  return results;
};

// Return the length of the input array.
stats.count = function(values) {
  return values && values.length || 0;
};

// Count the number of non-null, non-undefined, non-NaN values.
stats.count.valid = function(values, f) {
  f = util.$(f);
  var v, i, n, valid = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) valid += 1;
  }
  return valid;
};

// Count the number of null or undefined values.
stats.count.missing = function(values, f) {
  f = util.$(f);
  var v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

// Count the number of distinct values.
// Null, undefined and NaN are each considered distinct values.
stats.count.distinct = function(values, f) {
  f = util.$(f);
  var u = {}, v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// Construct a map from distinct values to occurrence counts.
stats.count.map = function(values, f) {
  f = util.$(f);
  var map = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    map[v] = (v in map) ? map[v] + 1 : 1;
  }
  return map;
};

// Compute the median of an array of numbers.
stats.median = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  return stats.quantile(values, 0.5);
};

// Computes the quartile boundaries of an array of numbers.
stats.quartile = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  var q = stats.quantile;
  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
};

// Compute the quantile of a sorted array of numbers.
// Adapted from the D3.js implementation.
stats.quantile = function(values, f, p) {
  if (p === undefined) { p = f; f = util.identity; }
  f = util.$(f);
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +f(values[h - 1]),
      e = H - h;
  return e ? v + e * (f(values[h]) - v) : v;
};

// Compute the sum of an array of numbers.
stats.sum = function(values, f) {
  f = util.$(f);
  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) sum += v;
  }
  return sum;
};

// Compute the mean (average) of an array of numbers.
stats.mean = function(values, f) {
  f = util.$(f);
  var mean = 0, delta, i, n, c, v;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

// Compute the sample variance of an array of numbers.
stats.variance = function(values, f) {
  f = util.$(f);
  if (!util.isArray(values) || values.length < 2) return 0;
  var mean = 0, M2 = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (c - 1);
  return M2;
};

// Compute the sample standard deviation of an array of numbers.
stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
stats.modeskew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return std === 0 ? 0 : (avg - med) / std;
};

// Find the minimum value in an array.
stats.min = function(values, f) {
  return stats.extent(values, f)[0];
};

// Find the maximum value in an array.
stats.max = function(values, f) {
  return stats.extent(values, f)[1];
};

// Find the minimum and maximum of an array of values.
stats.extent = function(values, f) {
  f = util.$(f);
  var a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) a = v;
      if (v > b) b = v;
    }
  }
  return [a, b];
};

// Find the integer indices of the minimum and maximum values.
stats.extent.index = function(values, f) {
  f = util.$(f);
  var x = -1, y = -1, a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) { a = v; x = i; }
      if (v > b) { b = v; y = i; }
    }
  }
  return [x, y];
};

// Compute the dot product of two arrays of numbers.
stats.dot = function(values, a, b) {
  var sum = 0, i, v;
  if (!b) {
    if (values.length !== a.length) {
      throw Error('Array lengths must match.');
    }
    for (i=0; i<values.length; ++i) {
      v = values[i] * a[i];
      if (v === v) sum += v;
    }
  } else {
    a = util.$(a);
    b = util.$(b);
    for (i=0; i<values.length; ++i) {
      v = a(values[i]) * b(values[i]);
      if (v === v) sum += v;
    }
  }
  return sum;
};

// Compute ascending rank scores for an array of values.
// Ties are assigned their collective mean rank.
stats.rank = function(values, f) {
  f = util.$(f) || util.identity;
  var a = values.map(function(v, i) {
      return {idx: i, val: f(v)};
    })
    .sort(util.comparator('val'));

  var n = values.length,
      r = Array(n),
      tie = -1, p = {}, i, v, mu;

  for (i=0; i<n; ++i) {
    v = a[i].val;
    if (tie < 0 && p === v) {
      tie = i - 1;
    } else if (tie > -1 && p !== v) {
      mu = 1 + (i-1 + tie) / 2;
      for (; tie<i; ++tie) r[a[tie].idx] = mu;
      tie = -1;
    }
    r[a[i].idx] = i + 1;
    p = v;
  }

  if (tie > -1) {
    mu = 1 + (n-1 + tie) / 2;
    for (; tie<n; ++tie) r[a[tie].idx] = mu;
  }

  return r;
};

// Compute the sample Pearson product-moment correlation of two arrays of numbers.
stats.cor = function(values, a, b) {
  var fn = b;
  b = fn ? values.map(util.$(b)) : a;
  a = fn ? values.map(util.$(a)) : values;

  var dot = stats.dot(a, b),
      mua = stats.mean(a),
      mub = stats.mean(b),
      sda = stats.stdev(a),
      sdb = stats.stdev(b),
      n = values.length;

  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
};

// Compute the Spearman rank correlation of two arrays of values.
stats.cor.rank = function(values, a, b) {
  var ra = b ? stats.rank(values, util.$(a)) : stats.rank(values),
      rb = b ? stats.rank(values, util.$(b)) : stats.rank(a),
      n = values.length, i, s, d;

  for (i=0, s=0; i<n; ++i) {
    d = ra[i] - rb[i];
    s += d * d;
  }

  return 1 - 6*s / (n * (n*n-1));
};

// Compute the distance correlation of two arrays of numbers.
// http://en.wikipedia.org/wiki/Distance_correlation
stats.cor.dist = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a;

  var A = stats.dist.mat(X),
      B = stats.dist.mat(Y),
      n = A.length,
      i, aa, bb, ab;

  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
    aa += A[i]*A[i];
    bb += B[i]*B[i];
    ab += A[i]*B[i];
  }

  return Math.sqrt(ab / Math.sqrt(aa*bb));
};

// Compute the vector distance between two arrays of numbers.
// Default is Euclidean (exp=2) distance, configurable via exp argument.
stats.dist = function(values, a, b, exp) {
  var f = util.isFunction(b) || util.isString(b),
      X = values,
      Y = f ? values : a,
      e = f ? exp : b,
      L2 = e === 2 || e == null,
      n = values.length, s = 0, d, i;
  if (f) {
    a = util.$(a);
    b = util.$(b);
  }
  for (i=0; i<n; ++i) {
    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
    s += L2 ? d*d : Math.pow(Math.abs(d), e);
  }
  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
};

// Construct a mean-centered distance matrix for an array of numbers.
stats.dist.mat = function(X) {
  var n = X.length,
      m = n*n,
      A = Array(m),
      R = gen.zeros(n),
      M = 0, v, i, j;

  for (i=0; i<n; ++i) {
    A[i*n+i] = 0;
    for (j=i+1; j<n; ++j) {
      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
      A[j*n+i] = v;
      R[i] += v;
      R[j] += v;
    }
  }

  for (i=0; i<n; ++i) {
    M += R[i];
    R[i] /= n;
  }
  M /= m;

  for (i=0; i<n; ++i) {
    for (j=i; j<n; ++j) {
      A[i*n+j] += M - R[i] - R[j];
      A[j*n+i] = A[i*n+j];
    }
  }

  return A;
};

// Compute the Shannon entropy (log base 2) of an array of counts.
stats.entropy = function(counts, f) {
  f = util.$(f);
  var i, p, s = 0, H = 0, n = counts.length;
  for (i=0; i<n; ++i) {
    s += (f ? f(counts[i]) : counts[i]);
  }
  if (s === 0) return 0;
  for (i=0; i<n; ++i) {
    p = (f ? f(counts[i]) : counts[i]) / s;
    if (p) H += p * Math.log(p);
  }
  return -H / Math.LN2;
};

// Compute the mutual information between two discrete variables.
// Returns an array of the form [MI, MI_distance]
// MI_distance is defined as 1 - I(a,b) / H(a,b).
// http://en.wikipedia.org/wiki/Mutual_information
stats.mutual = function(values, a, b, counts) {
  var x = counts ? values.map(util.$(a)) : values,
      y = counts ? values.map(util.$(b)) : a,
      z = counts ? values.map(util.$(counts)) : b;

  var px = {},
      py = {},
      n = z.length,
      s = 0, I = 0, H = 0, p, t, i;

  for (i=0; i<n; ++i) {
    px[x[i]] = 0;
    py[y[i]] = 0;
  }

  for (i=0; i<n; ++i) {
    px[x[i]] += z[i];
    py[y[i]] += z[i];
    s += z[i];
  }

  t = 1 / (s * Math.LN2);
  for (i=0; i<n; ++i) {
    if (z[i] === 0) continue;
    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
    I += z[i] * t * Math.log(p);
    H += z[i] * t * Math.log(z[i]/s);
  }

  return [I, 1 + I/H];
};

// Compute the mutual information between two discrete variables.
stats.mutual.info = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[0];
};

// Compute the mutual information distance between two discrete variables.
// MI_distance is defined as 1 - I(a,b) / H(a,b).
stats.mutual.dist = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[1];
};

// Compute a profile of summary statistics for a variable.
stats.profile = function(values, f) {
  var mean = 0,
      valid = 0,
      missing = 0,
      distinct = 0,
      min = null,
      max = null,
      M2 = 0,
      vals = [],
      u = {}, delta, sd, i, v, x;

  // compute summary stats
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];

    // update unique values
    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

    if (v == null) {
      ++missing;
    } else if (util.isValid(v)) {
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      if (min===null || x < min) min = x;
      if (max===null || x > max) max = x;
      delta = x - mean;
      mean = mean + delta / (++valid);
      M2 = M2 + delta * (x - mean);
      vals.push(x);
    }
  }
  M2 = M2 / (valid - 1);
  sd = Math.sqrt(M2);

  // sort values for median and iqr
  vals.sort(util.cmp);

  return {
    type:     type(values, f),
    unique:   u,
    count:    values.length,
    valid:    valid,
    missing:  missing,
    distinct: distinct,
    min:      min,
    max:      max,
    mean:     mean,
    stdev:    sd,
    median:   (v = stats.quantile(vals, 0.5)),
    q1:       stats.quantile(vals, 0.25),
    q3:       stats.quantile(vals, 0.75),
    modeskew: sd === 0 ? 0 : (mean - v) / sd
  };
};

// Compute profiles for all variables in a data set.
stats.summary = function(data, fields) {
  fields = fields || util.keys(data[0]);
  var s = fields.map(function(f) {
    var p = stats.profile(data, util.$(f));
    return (p.field = f, p);
  });
  return (s.__summary__ = true, s);
};

module.exports = stats;

},{"./generate":4,"./import/type":5,"./util":8}],7:[function(require,module,exports){
var d3_time = require('d3-time');

var tempDate = new Date(),
    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

function date(d) {
  return (tempDate.setTime(+d), tempDate);
}

// create a time unit entry
function entry(type, date, unit, step, min, max) {
  var e = {
    type: type,
    date: date,
    unit: unit
  };
  if (step) {
    e.step = step;
  } else {
    e.minstep = 1;
  }
  if (min != null) e.min = min;
  if (max != null) e.max = max;
  return e;
}

function create(type, unit, base, step, min, max) {
  return entry(type,
    function(d) { return unit.offset(base, d); },
    function(d) { return unit.count(base, d); },
    step, min, max);
}

var locale = [
  create('second', d3_time.second, baseDate),
  create('minute', d3_time.minute, baseDate),
  create('hour',   d3_time.hour,   baseDate),
  create('day',    d3_time.day,    baseDate, [1, 7]),
  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
  create('year',   d3_time.year,   baseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
    function(d) { return date(d).getSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(1970, 0, 1, 0, d); },
    function(d) { return date(d).getMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(1970, 0, 1, d); },
    function(d) { return date(d).getHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(1970, 0, 4+d); },
    function(d) { return date(d).getDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(1970, 0, d); },
    function(d) { return date(d).getDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(1970, d % 12, 1); },
    function(d) { return date(d).getMonth(); },
    [1], 0, 11
  )
];

var utc = [
  create('second', d3_time.utcSecond, utcBaseDate),
  create('minute', d3_time.utcMinute, utcBaseDate),
  create('hour',   d3_time.utcHour,   utcBaseDate),
  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
  create('year',   d3_time.utcYear,   utcBaseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
    function(d) { return date(d).getUTCSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
    function(d) { return date(d).getUTCMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
    function(d) { return date(d).getUTCHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
    function(d) { return date(d).getUTCDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(Date.UTC(1970, 0, d)); },
    function(d) { return date(d).getUTCDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
    function(d) { return date(d).getUTCMonth(); },
    [1], 0, 11
  )
];

var STEPS = [
  [31536e6, 5],  // 1-year
  [7776e6, 4],   // 3-month
  [2592e6, 4],   // 1-month
  [12096e5, 3],  // 2-week
  [6048e5, 3],   // 1-week
  [1728e5, 3],   // 2-day
  [864e5, 3],    // 1-day
  [432e5, 2],    // 12-hour
  [216e5, 2],    // 6-hour
  [108e5, 2],    // 3-hour
  [36e5, 2],     // 1-hour
  [18e5, 1],     // 30-minute
  [9e5, 1],      // 15-minute
  [3e5, 1],      // 5-minute
  [6e4, 1],      // 1-minute
  [3e4, 0],      // 30-second
  [15e3, 0],     // 15-second
  [5e3, 0],      // 5-second
  [1e3, 0]       // 1-second
];

function find(units, span, minb, maxb) {
  var step = STEPS[0], i, n, bins;

  for (i=1, n=STEPS.length; i<n; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return units[STEPS[i-1][1]];
      }
      if (bins >= minb) {
        return units[step[1]];
      }
    }
  }
  return units[STEPS[n-1][1]];
}

function toUnitMap(units) {
  var map = {}, i, n;
  for (i=0, n=units.length; i<n; ++i) {
    map[units[i].type] = units[i];
  }
  map.find = function(span, minb, maxb) {
    return find(units, span, minb, maxb);
  };
  return map;
}

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);

},{"d3-time":2}],8:[function(require,module,exports){
var buffer = require('buffer'),
    time = require('./time'),
    utc = time.utc;

var u = module.exports = {};

// utility functions

var FNAME = '__name__';

u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

u.name = function(f) { return f==null ? null : f[FNAME]; };

u.identity = function(x) { return x; };

u.true = u.namedfunc('true', function() { return true; });

u.false = u.namedfunc('false', function() { return false; });

u.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

u.equal = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

u.extend = function(obj) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

u.length = function(x) {
  return x != null && x.length != null ? x.length : null;
};

u.keys = function(x) {
  var keys = [], k;
  for (k in x) keys.push(k);
  return keys;
};

u.vals = function(x) {
  var vals = [], k;
  for (k in x) vals.push(x[k]);
  return vals;
};

u.toMap = function(list, f) {
  return (f = u.$(f)) ?
    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  var n = values.length;
  if (!n) return '';
  for (var s=String(values[0]), i=1; i<n; ++i) {
    s += '|' + String(values[i]);
  }
  return s;
};

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) === '[object Function]';
};

u.isString = function(obj) {
  return typeof value === 'string' || toString.call(obj) === '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

u.isNumber = function(obj) {
  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
};

u.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) === '[object Date]';
};

u.isValid = function(obj) {
  return obj != null && obj === obj;
};

u.isBuffer = (buffer.Buffer && buffer.Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) {
  return s == null || s === '' ? null : +s;
};

u.boolean = function(s) {
  return s == null || s === '' ? null : s==='false' ? false : !!s;
};

u.date = function(s) {
  return s == null || s === '' ? null : Date.parse(s);
};

u.array = function(x) {
  return x != null ? (u.isArray(x) ? x : [x]) : [];
};

u.str = function(x) {
  return u.isArray(x) ? '[' + x.map(u.str) + ']'
    : u.isObject(x) ? JSON.stringify(x)
    : u.isString(x) ? ('\''+util_escape_str(x)+'\'') : x;
};

var escape_str_re = /(^|[^\\])'/g;

function util_escape_str(x) {
  return x.replace(escape_str_re, '$1\\\'');
}

// data access functions

var field_re = /\[(.*?)\]|[^.\[]+/g;

u.field = function(f) {
  return String(f).match(field_re).map(function(d) {
    return d[0] !== '[' ? d :
      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
      d.slice(2, -2).replace(/\\(["'])/g, '$1');
  });
};

u.accessor = function(f) {
  var s;
  return f==null || u.isFunction(f) ? f :
    u.namedfunc(f, (s = u.field(f)).length > 1 ?
      function(x) { return s.reduce(function(x,f) { return x[f]; }, x); } :
      function(x) { return x[f]; }
    );
};

// short-cut for accessor
u.$ = u.accessor;

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1 ?
    function(x, v) {
      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
      x[s[i]] = v;
    } :
    function(x, v) { x[f] = v; };
};


u.$func = function(name, op) {
  return function(f) {
    f = u.$(f) || u.identity;
    var n = name + (u.name(f) ? '_'+u.name(f) : '');
    return u.namedfunc(n, function(d) { return op(f(d)); });
  };
};

u.$valid  = u.$func('valid', u.isValid);
u.$length = u.$func('length', u.length);

u.$in = function(f, values) {
  f = u.$(f);
  var map = u.isArray(values) ? u.toMap(values) : values;
  return function(d) { return !!map[f(d)]; };
};

u.$year   = u.$func('year', time.year.unit);
u.$month  = u.$func('month', time.months.unit);
u.$date   = u.$func('date', time.dates.unit);
u.$day    = u.$func('day', time.weekdays.unit);
u.$hour   = u.$func('hour', time.hours.unit);
u.$minute = u.$func('minute', time.minutes.unit);
u.$second = u.$func('second', time.seconds.unit);

u.$utcYear   = u.$func('utcYear', utc.year.unit);
u.$utcMonth  = u.$func('utcMonth', utc.months.unit);
u.$utcDate   = u.$func('utcDate', utc.dates.unit);
u.$utcDay    = u.$func('utcDay', utc.weekdays.unit);
u.$utcHour   = u.$func('utcHour', utc.hours.unit);
u.$utcMinute = u.$func('utcMinute', utc.minutes.unit);
u.$utcSecond = u.$func('utcSecond', utc.seconds.unit);

// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === '-') { s = -1; f = f.slice(1); }
    else if (f[0] === '+') { s = +1; f = f.slice(1); }
    sign.push(s);
    return u.accessor(f);
  });
  return function(a,b) {
    var i, n, f, x, y;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i]; x = f(a); y = f(b);
      if (x < y) return -1 * sign[i];
      if (x > y) return sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
};

u.numcmp = function(a, b) { return a - b; };

u.stablesort = function(array, sortBy, keyFn) {
  var indices = array.reduce(function(idx, v, i) {
    return (idx[keyFn(v)] = i, idx);
  }, {});

  array.sort(function(a, b) {
    var sa = sortBy(a),
        sb = sortBy(b);
    return sa < sb ? -1 : sa > sb ? 1
         : (indices[keyFn(a)] - indices[keyFn(b)]);
  });

  return array;
};


// string functions

u.pad = function(s, length, pos, padchar) {
  padchar = padchar || " ";
  var d = length - s.length;
  if (d <= 0) return s;
  switch (pos) {
    case 'left':
      return strrep(d, padchar) + s;
    case 'middle':
    case 'center':
      return strrep(Math.floor(d/2), padchar) +
         s + strrep(Math.ceil(d/2), padchar);
    default:
      return s + strrep(d, padchar);
  }
};

function strrep(n, str) {
  var s = "", i;
  for (i=0; i<n; ++i) s += str;
  return s;
}

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case 'left':
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case 'middle':
    case 'center':
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join('').trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

},{"./time":7,"buffer":1}],9:[function(require,module,exports){
exports.AGGREGATE_OPS = [
    'values', 'count', 'valid', 'missing', 'distinct',
    'sum', 'mean', 'average', 'variance', 'variancep', 'stdev',
    'stdevp', 'median', 'q1', 'q3', 'modeskew', 'min', 'max',
    'argmin', 'argmax'
];
exports.SHARED_DOMAIN_OPS = [
    'mean', 'average', 'stdev', 'stdevp', 'median', 'q1', 'q3', 'min', 'max'
];
},{}],10:[function(require,module,exports){
exports.MAXBINS_DEFAULT = 15;
},{}],11:[function(require,module,exports){
exports.X = 'x';
exports.Y = 'y';
exports.ROW = 'row';
exports.COLUMN = 'column';
exports.SHAPE = 'shape';
exports.SIZE = 'size';
exports.COLOR = 'color';
exports.TEXT = 'text';
exports.DETAIL = 'detail';
exports.CHANNELS = [exports.X, exports.Y, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.TEXT, exports.DETAIL];
;
function supportMarktype(channel, marktype) {
    return !!getSupportedMarktype(channel)[marktype];
}
exports.supportMarktype = supportMarktype;
function getSupportedMarktype(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, line: true, area: true
            };
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, text: true
            };
        case exports.COLOR:
        case exports.DETAIL:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
    }
    return {};
}
exports.getSupportedMarktype = getSupportedMarktype;
;
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
        case exports.DETAIL:
            return {
                measure: false,
                dimension: true
            };
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;
},{}],12:[function(require,module,exports){
var bin_1 = require('../bin');
var channel_1 = require('../channel');
var data_1 = require('../data');
var vlFieldDef = require('../fielddef');
var vlEncoding = require('../encoding');
var layout_1 = require('./layout');
var marktype_1 = require('../marktype');
var schema = require('../schema/schema');
var schemaUtil = require('../schema/schemautil');
var type_1 = require('../type');
var util_1 = require('../util');
var time = require('./time');
var Model = (function () {
    function Model(spec, theme) {
        this.numberFormat = function (channel) {
            return this.config('numberFormat');
        };
        var defaults = schema.instantiate();
        this._spec = schemaUtil.merge(defaults, theme || {}, spec);
        vlEncoding.forEach(this._spec.encoding, function (fieldDef, channel) {
            if (fieldDef.type) {
                fieldDef.type = type_1.getFullName(fieldDef.type);
            }
        });
        this._stack = this.getStackProperties();
        this._layout = layout_1.compileLayout(this);
    }
    Model.prototype.getStackProperties = function () {
        var stackChannel = (this.has(channel_1.COLOR)) ? channel_1.COLOR : (this.has(channel_1.DETAIL)) ? channel_1.DETAIL : null;
        if (stackChannel &&
            (this.is(marktype_1.BAR) || this.is(marktype_1.AREA)) &&
            this.config('stack') !== false &&
            this.isAggregate()) {
            var isXMeasure = this.isMeasure(channel_1.X);
            var isYMeasure = this.isMeasure(channel_1.Y);
            if (isXMeasure && !isYMeasure) {
                return {
                    groupbyChannel: channel_1.Y,
                    fieldChannel: channel_1.X,
                    stackChannel: stackChannel,
                    config: this.config('stack')
                };
            }
            else if (isYMeasure && !isXMeasure) {
                return {
                    groupbyChannel: channel_1.X,
                    fieldChannel: channel_1.Y,
                    stackChannel: stackChannel,
                    config: this.config('stack')
                };
            }
        }
        return null;
    };
    Model.prototype.layout = function () {
        return this._layout;
    };
    Model.prototype.stack = function () {
        return this._stack;
    };
    Model.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this._spec.encoding), spec;
        spec = {
            marktype: this._spec.marktype,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this._spec.config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this._spec.data);
        }
        var defaults = schema.instantiate();
        return schemaUtil.subtract(spec, defaults);
    };
    Model.prototype.marktype = function () {
        return this._spec.marktype;
    };
    Model.prototype.is = function (m) {
        return this._spec.marktype === m;
    };
    Model.prototype.has = function (channel) {
        return this._spec.encoding[channel].field !== undefined;
    };
    Model.prototype.fieldDef = function (channel) {
        return this._spec.encoding[channel];
    };
    Model.prototype.field = function (channel, opt) {
        opt = opt || {};
        var fieldDef = this.fieldDef(channel);
        var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''), field = fieldDef.field;
        if (vlFieldDef.isCount(fieldDef)) {
            return f + 'count';
        }
        else if (opt.fn) {
            return f + opt.fn + '_' + field;
        }
        else if (!opt.nofn && fieldDef.bin) {
            var binSuffix = opt.binSuffix || '_start';
            return f + 'bin_' + field + binSuffix;
        }
        else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
            return f + fieldDef.aggregate + '_' + field;
        }
        else if (!opt.nofn && fieldDef.timeUnit) {
            return f + fieldDef.timeUnit + '_' + field;
        }
        else {
            return f + field;
        }
    };
    Model.prototype.fieldTitle = function (channel) {
        if (vlFieldDef.isCount(this._spec.encoding[channel])) {
            return vlFieldDef.COUNT_DISPLAYNAME;
        }
        var fn = this._spec.encoding[channel].aggregate || this._spec.encoding[channel].timeUnit || (this._spec.encoding[channel].bin && 'bin');
        if (fn) {
            return fn.toUpperCase() + '(' + this._spec.encoding[channel].field + ')';
        }
        else {
            return this._spec.encoding[channel].field;
        }
    };
    Model.prototype.bin = function (channel) {
        var bin = this._spec.encoding[channel].bin;
        if (bin === {})
            return false;
        if (bin === true)
            return {
                maxbins: bin_1.MAXBINS_DEFAULT
            };
        return bin;
    };
    Model.prototype.map = function (f) {
        return vlEncoding.map(this._spec.encoding, f);
    };
    Model.prototype.reduce = function (f, init) {
        return vlEncoding.reduce(this._spec.encoding, f, init);
    };
    Model.prototype.forEach = function (f) {
        return vlEncoding.forEach(this._spec.encoding, f);
    };
    Model.prototype.isOrdinalScale = function (channel) {
        var fieldDef = this.fieldDef(channel);
        return fieldDef && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) ||
            (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit &&
                time.scale.type(fieldDef.timeUnit, channel) === 'ordinal'));
    };
    Model.prototype.isDimension = function (channel) {
        return this.has(channel) &&
            vlFieldDef.isDimension(this.fieldDef(channel));
    };
    Model.prototype.isMeasure = function (channel) {
        return this.has(channel) &&
            vlFieldDef.isMeasure(this.fieldDef(channel));
    };
    Model.prototype.isAggregate = function () {
        return vlEncoding.isAggregate(this._spec.encoding);
    };
    Model.prototype.isFacet = function () {
        return this.has(channel_1.ROW) || this.has(channel_1.COLUMN);
    };
    Model.prototype.dataTable = function () {
        return this.isAggregate() ? data_1.SUMMARY : data_1.SOURCE;
    };
    Model.prototype.data = function () {
        return this._spec.data;
    };
    Model.prototype.hasValues = function () {
        var vals = this.data().values;
        return vals && vals.length;
    };
    Model.prototype.config = function (name) {
        return this._spec.config[name];
    };
    return Model;
})();
exports.Model = Model;
},{"../bin":10,"../channel":11,"../data":23,"../encoding":24,"../fielddef":25,"../marktype":26,"../schema/schema":36,"../schema/schemautil":37,"../type":42,"../util":43,"./layout":17,"./time":22}],13:[function(require,module,exports){
var util_1 = require('../util');
var type_1 = require('../type');
var channel_1 = require('../channel');
var time = require('./time');
function compileAxis(channel, model) {
    var isCol = channel === channel_1.COLUMN, isRow = channel === channel_1.ROW, type = isCol ? 'x' : isRow ? 'y' : channel;
    var def = {
        type: type,
        scale: channel
    };
    [
        'format', 'grid', 'layer', 'offset', 'orient', 'tickSize', 'ticks', 'title',
        'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
        'titleOffset', 'values', 'subdivide'
    ].forEach(function (property) {
        var method;
        var value = (method = exports[property]) ?
            method(model, channel, def) :
            model.fieldDef(channel).axis[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = model.fieldDef(channel).axis.properties || {};
    [
        'axis', 'labels',
        'grid', 'title', 'ticks', 'majorTicks', 'minorTicks'
    ].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel, props[group], def) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileAxis = compileAxis;
function format(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var format = fieldDef.axis.format;
    if (format !== undefined) {
        return format;
    }
    if (fieldDef.type === type_1.QUANTITATIVE) {
        return model.numberFormat(channel);
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        var timeUnit = fieldDef.timeUnit;
        if (!timeUnit) {
            return model.config('timeFormat');
        }
        else if (timeUnit === 'year') {
            return 'd';
        }
    }
    return undefined;
}
exports.format = format;
function grid(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var grid = fieldDef.axis.grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.isOrdinalScale(channel) && !fieldDef.bin;
}
exports.grid = grid;
function layer(model, channel, def) {
    var layer = model.fieldDef(channel).axis.layer;
    if (layer !== undefined) {
        return layer;
    }
    if (def.grid) {
        return 'back';
    }
    return undefined;
}
exports.layer = layer;
;
function offset(model, channel, def) {
    var offset = model.fieldDef(channel).axis.offset;
    if (offset) {
        return offset;
    }
    if ((channel === channel_1.ROW && !model.has(channel_1.Y)) ||
        (channel === channel_1.COLUMN && !model.has(channel_1.X))) {
        return model.config('cell').gridOffset;
    }
    return undefined;
}
exports.offset = offset;
function orient(model, channel) {
    var orient = model.fieldDef(channel).axis.orient;
    if (orient) {
        return orient;
    }
    else if (channel === channel_1.COLUMN) {
        return 'top';
    }
    else if (channel === channel_1.ROW) {
        if (model.has(channel_1.Y) && model.fieldDef(channel_1.Y).axis.orient !== 'right') {
            return 'right';
        }
    }
    return undefined;
}
exports.orient = orient;
function ticks(model, channel) {
    var ticks = model.fieldDef(channel).axis.ticks;
    if (ticks !== undefined) {
        return ticks;
    }
    if (channel === channel_1.X && !model.fieldDef(channel).bin) {
        return 5;
    }
    return undefined;
}
exports.ticks = ticks;
function tickSize(model, channel) {
    var tickSize = model.fieldDef(channel).axis.tickSize;
    if (tickSize !== undefined) {
        return tickSize;
    }
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return 0;
    }
    return undefined;
}
exports.tickSize = tickSize;
function title(model, channel) {
    var axisSpec = model.fieldDef(channel).axis;
    if (axisSpec.title !== undefined) {
        return axisSpec.title;
    }
    var fieldTitle = model.fieldTitle(channel);
    var layout = model.layout();
    var maxLength;
    if (axisSpec.titleMaxLength) {
        maxLength = axisSpec.titleMaxLength;
    }
    else if (channel === channel_1.X && typeof layout.cellWidth === 'number') {
        maxLength = layout.cellWidth / model.config('characterWidth');
    }
    else if (channel === channel_1.Y && typeof layout.cellHeight === 'number') {
        maxLength = layout.cellHeight / model.config('characterWidth');
    }
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
var properties;
(function (properties) {
    function axis(model, channel, spec) {
        if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
            return util_1.extend({
                opacity: { value: 0 }
            }, spec || {});
        }
        return spec || undefined;
    }
    properties.axis = axis;
    function labels(model, channel, spec, def) {
        var fieldDef = model.fieldDef(channel);
        var filterName = time.labelTemplate(fieldDef.timeUnit, fieldDef.axis.shortTimeNames);
        if (fieldDef.type === type_1.TEMPORAL && filterName) {
            spec = util_1.extend({
                text: { template: '{{datum.data | ' + filterName + '}}' }
            }, spec || {});
        }
        if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) && fieldDef.axis.labelMaxLength) {
            spec = util_1.extend({
                text: {
                    template: '{{ datum.data | truncate:' + fieldDef.axis.labelMaxLength + '}}'
                }
            }, spec || {});
        }
        switch (channel) {
            case channel_1.X:
                if (model.isDimension(channel_1.X) || fieldDef.type === type_1.TEMPORAL) {
                    spec = util_1.extend({
                        angle: { value: 270 },
                        align: { value: def.orient === 'top' ? 'left' : 'right' },
                        baseline: { value: 'middle' }
                    }, spec || {});
                }
                break;
            case channel_1.ROW:
                if (def.orient === 'right') {
                    spec = util_1.extend({
                        angle: { value: 90 },
                        align: { value: 'center' },
                        baseline: { value: 'bottom' }
                    }, spec || {});
                }
        }
        return spec || undefined;
    }
    properties.labels = labels;
})(properties || (properties = {}));
},{"../channel":11,"../type":42,"../util":43,"./time":22}],14:[function(require,module,exports){
var Model_1 = require('./Model');
var axis_1 = require('./axis');
var data_1 = require('./data');
var facet_1 = require('./facet');
var legend_1 = require('./legend');
var marks_1 = require('./marks');
var scale_1 = require('./scale');
var util_1 = require('../util');
var data_2 = require('../data');
var channel_1 = require('../channel');
var Model_2 = require('./Model');
exports.Model = Model_2.Model;
function compile(spec, theme) {
    var model = new Model_1.Model(spec, theme);
    var layout = model.layout();
    var rootGroup = {
        name: 'root',
        type: 'group',
        from: { data: data_2.LAYOUT },
        properties: {
            update: {
                width: layout.width.field ?
                    { field: layout.width.field } :
                    { value: layout.width },
                height: layout.height.field ?
                    { field: layout.height.field } :
                    { value: layout.height }
            }
        }
    };
    var marks = marks_1.compileMarks(model);
    if (model.has(channel_1.ROW) || model.has(channel_1.COLUMN)) {
        util_1.extend(rootGroup, facet_1.facetMixins(model, marks));
    }
    else {
        rootGroup.marks = marks.map(function (marks) {
            marks.from = marks.from || {};
            marks.from.data = model.dataTable();
            return marks;
        });
        var scaleNames = model.map(function (_, channel) {
            return channel;
        });
        rootGroup.scales = scale_1.compileScales(scaleNames, model);
        var axes = (model.has(channel_1.X) ? [axis_1.compileAxis(channel_1.X, model)] : [])
            .concat(model.has(channel_1.Y) ? [axis_1.compileAxis(channel_1.Y, model)] : []);
        if (axes.length > 0) {
            rootGroup.axes = axes;
        }
    }
    var legends = legend_1.compileLegends(model);
    if (legends.length > 0) {
        rootGroup.legends = legends;
    }
    var FIT = 1;
    var output = {
        width: layout.width.field ? FIT : layout.width,
        height: layout.height.field ? FIT : layout.height,
        padding: 'auto',
        data: data_1.compileData(model),
        marks: [rootGroup]
    };
    return {
        spec: output
    };
}
exports.compile = compile;
},{"../channel":11,"../data":23,"../util":43,"./Model":12,"./axis":13,"./data":15,"./facet":16,"./legend":18,"./marks":19,"./scale":20}],15:[function(require,module,exports){
var vlFieldDef = require('../fielddef');
var util = require('../util');
var bin_1 = require('../bin');
var channel_1 = require('../channel');
var data_1 = require('../data');
var time = require('./time');
var type_1 = require('../type');
function compileData(model) {
    var def = [source.def(model)];
    var summaryDef = summary.def(model);
    if (summaryDef) {
        def.push(summaryDef);
    }
    filterNonPositiveForLog(def[def.length - 1], model);
    var statsDef = layout.def(model);
    if (statsDef) {
        def.push(statsDef);
    }
    var stackDef = model.stack();
    if (stackDef) {
        def.push(stack.def(model, stackDef));
    }
    return def;
}
exports.compileData = compileData;
var source;
(function (source_1) {
    function def(model) {
        var source = { name: data_1.SOURCE };
        if (model.hasValues()) {
            source.values = model.data().values;
            source.format = { type: 'json' };
        }
        else {
            source.url = model.data().url;
            source.format = { type: model.data().formatType };
        }
        var parse = formatParse(model);
        if (parse) {
            source.format.parse = parse;
        }
        source.transform = transform(model);
        return source;
    }
    source_1.def = def;
    function formatParse(model) {
        var parse;
        model.forEach(function (fieldDef) {
            if (fieldDef.type === type_1.TEMPORAL) {
                parse = parse || {};
                parse[fieldDef.field] = 'date';
            }
            else if (fieldDef.type === type_1.QUANTITATIVE) {
                if (vlFieldDef.isCount(fieldDef))
                    return;
                parse = parse || {};
                parse[fieldDef.field] = 'number';
            }
        });
        return parse;
    }
    function transform(model) {
        return nullFilterTransform(model).concat(formulaTransform(model), timeTransform(model), binTransform(model), filterTransform(model));
    }
    source_1.transform = transform;
    function timeTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
                var field = model.field(channel, { nofn: true, datum: true });
                transform.push({
                    type: 'formula',
                    field: model.field(channel),
                    expr: time.formula(fieldDef.timeUnit, field)
                });
            }
            return transform;
        }, []);
    }
    source_1.timeTransform = timeTransform;
    function binTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            var bin = model.bin(channel);
            if (bin) {
                transform.push({
                    type: 'bin',
                    field: fieldDef.field,
                    output: {
                        start: model.field(channel, { binSuffix: '_start' }),
                        mid: model.field(channel, { binSuffix: '_mid' }),
                        end: model.field(channel, { binSuffix: '_end' })
                    },
                    maxbins: typeof bin === 'boolean' ? bin_1.MAXBINS_DEFAULT : bin.maxbins
                });
            }
            return transform;
        }, []);
    }
    source_1.binTransform = binTransform;
    function nullFilterTransform(model) {
        var filterNull = model.config('filterNull');
        var filteredFields = util.keys(model.reduce(function (filteredFields, fieldDef) {
            if (fieldDef.field && fieldDef.field !== '*' && filterNull[fieldDef.type]) {
                filteredFields[fieldDef.field] = true;
            }
            return filteredFields;
        }, {}));
        return filteredFields.length > 0 ?
            [{
                    type: 'filter',
                    test: filteredFields.map(function (fieldName) {
                        return 'datum.' + fieldName + '!==null';
                    }).join(' && ')
                }] : [];
    }
    source_1.nullFilterTransform = nullFilterTransform;
    function filterTransform(model) {
        var filter = model.data().filter;
        return filter ? [{
                type: 'filter',
                test: filter
            }] : [];
    }
    source_1.filterTransform = filterTransform;
    function formulaTransform(model) {
        var calculate = model.data().calculate;
        if (calculate === undefined) {
            return [];
        }
        return calculate.reduce(function (transform, formula) {
            transform.push(util.extend({ type: 'formula' }, formula));
            return transform;
        }, []);
    }
    source_1.formulaTransform = formulaTransform;
})(source = exports.source || (exports.source = {}));
var layout;
(function (layout_1) {
    function def(model) {
        var summarize = [];
        var formulas = [];
        if (model.has(channel_1.X) && model.isOrdinalScale(channel_1.X)) {
            summarize.push({
                field: model.field(channel_1.X),
                ops: ['distinct']
            });
            var xScale = model.fieldDef(channel_1.X).scale;
            formulas.push({
                type: 'formula',
                field: 'cellWidth',
                expr: '(' + model.field(channel_1.X, { datum: true, prefn: 'distinct_' }) + ' + ' +
                    xScale.padding + ') * ' + xScale.bandWidth
            });
        }
        if (model.has(channel_1.Y) && model.isOrdinalScale(channel_1.Y)) {
            summarize.push({
                field: model.field(channel_1.Y),
                ops: ['distinct']
            });
            var yScale = model.fieldDef(channel_1.Y).scale;
            formulas.push({
                type: 'formula',
                field: 'cellHeight',
                expr: '(' + model.field(channel_1.Y, { datum: true, prefn: 'distinct_' }) + ' + ' +
                    yScale.padding + ') * ' + yScale.bandWidth
            });
        }
        var cellPadding = model.config('cell').padding;
        var layout = model.layout();
        if (model.has(channel_1.COLUMN)) {
            var cellWidth = layout.cellWidth.field ?
                'datum.' + layout.cellWidth.field :
                layout.cellWidth;
            var distinctCol = model.field(channel_1.COLUMN, { datum: true, prefn: 'distinct_' });
            summarize.push({
                field: model.fieldDef(channel_1.COLUMN).field,
                ops: ['distinct']
            });
            formulas.push({
                type: 'formula',
                field: 'width',
                expr: cellWidth + ' * ' + distinctCol + ' + ' +
                    '(' + distinctCol + ' - 1) * ' + cellPadding
            });
        }
        if (model.has(channel_1.ROW)) {
            var cellHeight = layout.cellHeight.field ?
                'datum.' + layout.cellHeight.field :
                layout.cellHeight;
            var distinctRow = model.field(channel_1.ROW, { datum: true, prefn: 'distinct_' });
            summarize.push({
                field: model.fieldDef(channel_1.ROW).field,
                ops: ['distinct']
            });
            formulas.push({
                type: 'formula',
                field: 'height',
                expr: cellHeight + ' * ' + distinctRow + ' + ' +
                    '(' + distinctRow + ' - 1) * ' + cellPadding
            });
        }
        if (summarize.length > 0) {
            return {
                name: data_1.LAYOUT,
                source: model.dataTable(),
                transform: [{
                        type: 'aggregate',
                        summarize: summarize
                    }].concat(formulas)
            };
        }
        return null;
    }
    layout_1.def = def;
})(layout = exports.layout || (exports.layout = {}));
var summary;
(function (summary) {
    function def(model) {
        var dims = {};
        var meas = {};
        var hasAggregate = false;
        model.forEach(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                hasAggregate = true;
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*'].count = true;
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                }
            }
            else {
                if (fieldDef.bin) {
                    dims[model.field(channel, { binSuffix: '_start' })] = model.field(channel, { binSuffix: '_start' });
                    dims[model.field(channel, { binSuffix: '_mid' })] = model.field(channel, { binSuffix: '_mid' });
                    dims[model.field(channel, { binSuffix: '_end' })] = model.field(channel, { binSuffix: '_end' });
                }
                else {
                    dims[fieldDef.field] = model.field(channel);
                }
            }
        });
        var groupby = util.vals(dims);
        var summarize = util.reduce(meas, function (summarize, fnDictSet, field) {
            summarize[field] = util.keys(fnDictSet);
            return summarize;
        }, {});
        if (hasAggregate) {
            return {
                name: data_1.SUMMARY,
                source: data_1.SOURCE,
                transform: [{
                        type: 'aggregate',
                        groupby: groupby,
                        summarize: summarize
                    }]
            };
        }
        return null;
    }
    summary.def = def;
    ;
})(summary = exports.summary || (exports.summary = {}));
var stack;
(function (stack) {
    function def(model, stackProps) {
        var groupbyChannel = stackProps.groupbyChannel;
        var fieldChannel = stackProps.fieldChannel;
        var facetFields = (model.has(channel_1.COLUMN) ? [model.field(channel_1.COLUMN)] : [])
            .concat((model.has(channel_1.ROW) ? [model.field(channel_1.ROW)] : []));
        var stacked = {
            name: data_1.STACKED,
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(groupbyChannel)].concat(facetFields),
                    summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
                }]
        };
        if (facetFields && facetFields.length > 0) {
            stacked.transform.push({
                type: 'aggregate',
                groupby: facetFields,
                summarize: [{
                        ops: ['max'],
                        field: model.field(fieldChannel, { prefn: 'sum_' })
                    }]
            });
        }
        return stacked;
    }
    stack.def = def;
    ;
})(stack = exports.stack || (exports.stack = {}));
function filterNonPositiveForLog(dataTable, model) {
    model.forEach(function (_, channel) {
        if (model.fieldDef(channel).scale.type === 'log') {
            dataTable.transform.push({
                type: 'filter',
                test: model.field(channel, { datum: true }) + ' > 0'
            });
        }
    });
}
exports.filterNonPositiveForLog = filterNonPositiveForLog;
},{"../bin":10,"../channel":11,"../data":23,"../fielddef":25,"../type":42,"../util":43,"./time":22}],16:[function(require,module,exports){
var util = require('../util');
var channel_1 = require('../channel');
var axis_1 = require('./axis');
var scale_1 = require('./scale');
function facetMixins(model, marks) {
    var layout = model.layout();
    var cellWidth = !model.has(channel_1.COLUMN) ?
        { field: { group: 'width' } } :
        layout.cellWidth.field ?
            { scale: 'column', band: true } :
            { value: layout.cellWidth };
    var cellHeight = !model.has(channel_1.ROW) ?
        { field: { group: 'height' } } :
        layout.cellHeight.field ?
            { scale: 'row', band: true } :
            { value: layout.cellHeight };
    var facetGroupProperties = {
        width: cellWidth,
        height: cellHeight
    };
    var cellConfig = model.config('cell');
    ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
        'strokeOpacity', 'strokeDash', 'strokeDashOffset']
        .forEach(function (property) {
        var value = cellConfig[property];
        if (value !== undefined) {
            facetGroupProperties[property] = value;
        }
    });
    var rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
    var hasRow = model.has(channel_1.ROW), hasCol = model.has(channel_1.COLUMN);
    if (hasRow) {
        if (!model.isDimension(channel_1.ROW)) {
            util.error('Row encoding should be ordinal.');
        }
        facetGroupProperties.y = {
            scale: channel_1.ROW,
            field: model.field(channel_1.ROW)
        };
        facetKeys.push(model.field(channel_1.ROW));
        rootAxes.push(axis_1.compileAxis(channel_1.ROW, model));
        if (model.has(channel_1.X)) {
            rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
        }
        rootMarks.push(getRowRulesGroup(model, cellHeight));
    }
    else {
        if (model.has(channel_1.X)) {
            cellAxes.push(axis_1.compileAxis(channel_1.X, model));
        }
    }
    if (hasCol) {
        if (!model.isDimension(channel_1.COLUMN)) {
            util.error('Col encoding should be ordinal.');
        }
        facetGroupProperties.x = {
            scale: channel_1.COLUMN,
            field: model.field(channel_1.COLUMN)
        };
        facetKeys.push(model.field(channel_1.COLUMN));
        rootAxes.push(axis_1.compileAxis(channel_1.COLUMN, model));
        if (model.has(channel_1.Y)) {
            rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
        }
        rootMarks.push(getColumnRulesGroup(model, cellWidth));
    }
    else {
        if (model.has(channel_1.Y)) {
            cellAxes.push(axis_1.compileAxis(channel_1.Y, model));
        }
    }
    var facetGroup = {
        name: 'cell',
        type: 'group',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: facetKeys }]
        },
        properties: {
            update: facetGroupProperties
        },
        marks: marks
    };
    if (cellAxes.length > 0) {
        facetGroup.axes = cellAxes;
    }
    rootMarks.push(facetGroup);
    var scaleNames = model.map(function (_, channel) {
        return channel;
    });
    return {
        marks: rootMarks,
        axes: rootAxes,
        scales: scale_1.compileScales(scaleNames, model)
    };
}
exports.facetMixins = facetMixins;
function getXAxesGroup(model, cellWidth, hasCol) {
    var xAxesGroup = {
        name: 'x-axes',
        type: 'group',
        properties: {
            update: {
                width: cellWidth,
                height: { field: { group: 'height' } },
                x: hasCol ? { scale: channel_1.COLUMN, field: model.field(channel_1.COLUMN) } : { value: 0 },
                y: { value: -model.config('cell').padding / 2 }
            }
        },
        axes: [axis_1.compileAxis(channel_1.X, model)]
    };
    if (hasCol) {
        xAxesGroup.from = {
            data: model.dataTable(),
            transform: { type: 'facet', groupby: [model.field(channel_1.COLUMN)] }
        };
    }
    return xAxesGroup;
}
function getYAxesGroup(model, cellHeight, hasRow) {
    var yAxesGroup = {
        name: 'y-axes',
        type: 'group',
        properties: {
            update: {
                width: { field: { group: 'width' } },
                height: cellHeight,
                x: { value: -model.config('cell').padding / 2 },
                y: hasRow ? { scale: channel_1.ROW, field: model.field(channel_1.ROW) } : { value: 0 }
            }
        },
        axes: [axis_1.compileAxis(channel_1.Y, model)]
    };
    if (hasRow) {
        yAxesGroup.from = {
            data: model.dataTable(),
            transform: { type: 'facet', groupby: [model.field(channel_1.ROW)] }
        };
    }
    return yAxesGroup;
}
function getRowRulesGroup(model, cellHeight) {
    var rowRulesOnTop = !model.has(channel_1.X) || model.fieldDef(channel_1.X).axis.orient !== 'top';
    var offset = model.config('cell').padding / 2 - 1;
    var rowRules = {
        name: 'row-rules',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.ROW)] }]
        },
        properties: {
            update: {
                y: {
                    scale: 'row',
                    field: model.field(channel_1.ROW),
                    offset: (rowRulesOnTop ? -1 : 1) * offset
                },
                x: { value: 0, offset: -model.config('cell').gridOffset },
                x2: { field: { group: 'width' }, offset: model.config('cell').gridOffset },
                stroke: { value: model.config('cell').gridColor },
                strokeOpacity: { value: model.config('cell').gridOpacity }
            }
        }
    };
    if (rowRulesOnTop) {
        return rowRules;
    }
    return {
        name: 'row-rules-group',
        type: 'group',
        properties: {
            update: {
                y: cellHeight.value ?
                    cellHeight :
                    { field: { parent: 'cellHeight' } },
                width: { field: { group: 'width' } }
            }
        },
        marks: [rowRules]
    };
}
function getColumnRulesGroup(model, cellWidth) {
    var colRulesOnLeft = !model.has(channel_1.Y) || model.fieldDef(channel_1.Y).axis.orient === 'right';
    var offset = model.config('cell').padding / 2 - 1;
    var columnRules = {
        name: 'column-rules',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.COLUMN)] }]
        },
        properties: {
            update: {
                x: {
                    scale: 'column',
                    field: model.field(channel_1.COLUMN),
                    offset: (colRulesOnLeft ? -1 : 1) * offset
                },
                y: { value: 0, offset: -model.config('cell').gridOffset },
                y2: { field: { group: 'height' }, offset: model.config('cell').gridOffset },
                stroke: { value: model.config('cell').gridColor },
                strokeOpacity: { value: model.config('cell').gridOpacity }
            }
        }
    };
    if (colRulesOnLeft) {
        return columnRules;
    }
    return {
        name: 'column-rules-group',
        type: 'group',
        properties: {
            update: {
                x: cellWidth.value ?
                    cellWidth :
                    { field: { parent: 'cellWidth' } },
                height: { field: { group: 'height' } }
            }
        },
        marks: [columnRules]
    };
}
},{"../channel":11,"../util":43,"./axis":13,"./scale":20}],17:[function(require,module,exports){
var channel_1 = require('../channel');
var data_1 = require('../data');
function compileLayout(model) {
    var cellWidth = getCellWidth(model);
    var cellHeight = getCellHeight(model);
    return {
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        width: getWidth(model, cellWidth),
        height: getHeight(model, cellHeight)
    };
}
exports.compileLayout = compileLayout;
function getCellWidth(model) {
    if (model.has(channel_1.X)) {
        if (model.isOrdinalScale(channel_1.X)) {
            return { data: data_1.LAYOUT, field: 'cellWidth' };
        }
        return model.config('cell').width;
    }
    if (model.marktype() === channel_1.TEXT) {
        return model.config('textCellWidth');
    }
    return model.fieldDef(channel_1.X).scale.bandWidth;
}
function getWidth(model, cellWidth) {
    if (model.has(channel_1.COLUMN)) {
        return { data: data_1.LAYOUT, field: 'width' };
    }
    return cellWidth;
}
function getCellHeight(model) {
    if (model.has(channel_1.Y)) {
        if (model.isOrdinalScale(channel_1.Y)) {
            return { data: data_1.LAYOUT, field: 'cellHeight' };
        }
        else {
            return model.config('cell').height;
        }
    }
    return model.fieldDef(channel_1.Y).scale.bandWidth;
}
function getHeight(model, cellHeight) {
    if (model.has(channel_1.ROW)) {
        return { data: data_1.LAYOUT, field: 'height' };
    }
    return cellHeight;
}
},{"../channel":11,"../data":23}],18:[function(require,module,exports){
var util_1 = require('../util');
var channel_1 = require('../channel');
var time = require('./time');
var type_1 = require('../type');
function compileLegends(model) {
    var defs = [];
    if (model.has(channel_1.COLOR) && model.fieldDef(channel_1.COLOR).legend) {
        defs.push(compileLegend(model, channel_1.COLOR, {
            fill: channel_1.COLOR
        }));
    }
    if (model.has(channel_1.SIZE) && model.fieldDef(channel_1.SIZE).legend) {
        defs.push(compileLegend(model, channel_1.SIZE, {
            size: channel_1.SIZE
        }));
    }
    if (model.has(channel_1.SHAPE) && model.fieldDef(channel_1.SHAPE).legend) {
        defs.push(compileLegend(model, channel_1.SHAPE, {
            shape: channel_1.SHAPE
        }));
    }
    return defs;
}
exports.compileLegends = compileLegends;
function compileLegend(model, channel, def) {
    var legend = model.fieldDef(channel).legend;
    def.title = title(model, channel);
    ['orient', 'format', 'values'].forEach(function (property) {
        var value = legend[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = (typeof legend !== 'boolean' && legend.properties) || {};
    ['title', 'labels', 'symbols', 'legend'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel, props[group]) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileLegend = compileLegend;
function title(model, channel) {
    var legend = model.fieldDef(channel).legend;
    if (typeof legend !== 'boolean' && legend.title) {
        return legend.title;
    }
    return model.fieldTitle(channel);
}
exports.title = title;
var properties;
(function (properties) {
    function labels(model, channel, spec) {
        var fieldDef = model.fieldDef(channel);
        var timeUnit = fieldDef.timeUnit;
        if (fieldDef.type === type_1.TEMPORAL && timeUnit && time.labelTemplate(timeUnit)) {
            return util_1.extend({
                text: {
                    template: '{{datum.data | ' + time.labelTemplate(timeUnit) + '}}'
                }
            }, spec || {});
        }
        return spec;
    }
    properties.labels = labels;
    function symbols(model, channel, spec) {
        var symbols = {};
        var marktype = model.marktype();
        switch (marktype) {
            case 'bar':
            case 'tick':
            case 'text':
                symbols.stroke = { value: 'transparent' };
                symbols.shape = { value: 'square' };
                break;
            case 'circle':
            case 'square':
                symbols.shape = { value: marktype };
            case 'point':
                if (model.config('marks').filled) {
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.fill = { scale: channel_1.COLOR, field: 'data' };
                    }
                    else {
                        symbols.fill = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    symbols.stroke = { value: 'transparent' };
                }
                else {
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.stroke = { scale: channel_1.COLOR, field: 'data' };
                    }
                    else {
                        symbols.stroke = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    symbols.fill = { value: 'transparent' };
                    symbols.strokeWidth = { value: model.config('marks').strokeWidth };
                }
                break;
            case 'line':
            case 'area':
                break;
        }
        var opacity = model.config('marks').opacity;
        if (opacity) {
            symbols.opacity = { value: opacity };
        }
        symbols = util_1.extend(symbols, spec || {});
        return util_1.keys(symbols).length > 0 ? symbols : undefined;
    }
    properties.symbols = symbols;
})(properties || (properties = {}));
},{"../channel":11,"../type":42,"../util":43,"./time":22}],19:[function(require,module,exports){
var channel_1 = require('../channel');
var marktype_1 = require('../marktype');
var type_1 = require('../type');
var stack_1 = require('./stack');
var MARKTYPES_MAP = {
    bar: 'rect',
    tick: 'rect',
    point: 'symbol',
    line: 'line',
    area: 'area',
    text: 'text',
    circle: 'symbol',
    square: 'symbol'
};
function compileMarks(model) {
    var marktype = model.marktype();
    if (marktype === marktype_1.LINE || marktype === marktype_1.AREA) {
        var sortBy = marktype === marktype_1.LINE ? model.config('sortLineBy') : undefined;
        if (!sortBy) {
            var sortField = (model.isMeasure(channel_1.X) && model.isDimension(channel_1.Y)) ? channel_1.Y : channel_1.X;
            sortBy = '-' + model.field(sortField);
        }
        var pathMarks = {
            type: MARKTYPES_MAP[marktype],
            from: {
                transform: [{ type: 'sort', by: sortBy }]
            },
            properties: {
                update: properties[marktype](model)
            }
        };
        var details = detailFields(model);
        if (details.length > 0) {
            var facetTransform = { type: 'facet', groupby: details };
            var transform = marktype === marktype_1.AREA && model.stack() ?
                [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
                [facetTransform];
            return [{
                    name: marktype + '-facet',
                    type: 'group',
                    from: {
                        transform: transform
                    },
                    properties: {
                        update: {
                            width: { field: { group: 'width' } },
                            height: { field: { group: 'height' } }
                        }
                    },
                    marks: [pathMarks]
                }];
        }
        else {
            return [pathMarks];
        }
    }
    else {
        var marks = [];
        if (marktype === marktype_1.TEXT && model.has(channel_1.COLOR)) {
            marks.push({
                type: 'rect',
                properties: { update: properties.textBackground(model) }
            });
        }
        var mainDef = {
            type: MARKTYPES_MAP[marktype],
            properties: {
                update: properties[marktype](model)
            }
        };
        var stack = model.stack();
        if (marktype === marktype_1.BAR && stack) {
            mainDef.from = {
                transform: [stack_1.stackTransform(model)]
            };
        }
        marks.push(mainDef);
        return marks;
    }
}
exports.compileMarks = compileMarks;
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}
var properties;
(function (properties) {
    function bar(model) {
        var stack = model.stack();
        var p = {};
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_start'
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_end'
            };
        }
        else if (model.fieldDef(channel_1.X).bin) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_start' }),
                offset: 1
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_end' })
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X)
            };
            if (!model.has(channel_1.Y) || model.isDimension(channel_1.Y)) {
                p.x2 = { value: 0 };
            }
        }
        else {
            if (model.has(channel_1.X)) {
                p.xc = {
                    scale: channel_1.X,
                    field: model.field(channel_1.X)
                };
            }
            else {
                p.x = { value: 0, offset: model.config('singleBarOffset') };
            }
        }
        if (!p.x2) {
            if (!model.has(channel_1.X) || model.isOrdinalScale(channel_1.X)) {
                if (model.has(channel_1.SIZE)) {
                    p.width = {
                        scale: channel_1.SIZE,
                        field: model.field(channel_1.SIZE)
                    };
                }
                else {
                    p.width = {
                        value: model.fieldDef(channel_1.X).scale.bandWidth,
                        offset: -1
                    };
                }
            }
            else {
                p.width = { value: 2 };
            }
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_start'
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_end'
            };
        }
        else if (model.fieldDef(channel_1.Y).bin) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_start' })
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_end' }),
                offset: 1
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y)
            };
            p.y2 = { field: { group: 'height' } };
        }
        else {
            if (model.has(channel_1.Y)) {
                p.yc = {
                    scale: channel_1.Y,
                    field: model.field(channel_1.Y)
                };
            }
            else {
                p.y2 = {
                    field: { group: 'height' },
                    offset: -model.config('singleBarOffset')
                };
            }
            if (model.has(channel_1.SIZE)) {
                p.height = {
                    scale: channel_1.SIZE,
                    field: model.field(channel_1.SIZE)
                };
            }
            else {
                p.height = {
                    value: model.fieldDef(channel_1.Y).scale.bandWidth,
                    offset: -1
                };
            }
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.config('marks').opacity;
        if (opacity)
            p.opacity = { value: opacity };
        return p;
    }
    properties.bar = bar;
    function point(model) {
        var p = {};
        var marksConfig = model.config('marks');
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.size = {
                scale: channel_1.SIZE,
                field: model.field(channel_1.SIZE)
            };
        }
        else if (!model.has(channel_1.SIZE)) {
            p.size = { value: model.fieldDef(channel_1.SIZE).value };
        }
        if (model.has(channel_1.SHAPE)) {
            p.shape = {
                scale: channel_1.SHAPE,
                field: model.field(channel_1.SHAPE)
            };
        }
        else if (!model.has(channel_1.SHAPE)) {
            p.shape = { value: model.fieldDef(channel_1.SHAPE).value };
        }
        if (marksConfig.filled) {
            if (model.has(channel_1.COLOR)) {
                p.fill = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.fill = { value: model.fieldDef(channel_1.COLOR).value };
            }
        }
        else {
            if (model.has(channel_1.COLOR)) {
                p.stroke = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
            }
            p.strokeWidth = { value: model.config('marks').strokeWidth };
        }
        var opacity = marksConfig.opacity;
        if (opacity) {
            p.opacity = { value: opacity };
        }
        return p;
    }
    properties.point = point;
    function line(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: 0 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { field: { group: 'height' } };
        }
        if (model.has(channel_1.COLOR)) {
            p.stroke = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else if (!model.has(channel_1.COLOR)) {
            p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.config('marks').opacity;
        if (opacity)
            p.opacity = { value: opacity };
        p.strokeWidth = { value: model.config('marks').strokeWidth };
        return p;
    }
    properties.line = line;
    function area(model) {
        var stack = model.stack();
        var p = {};
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_start'
            };
            p.x2 = {
                scale: channel_1.X,
                field: model.field(channel_1.X) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            p.x = { scale: channel_1.X, field: model.field(channel_1.X) };
            if (model.isDimension(channel_1.Y)) {
                p.x2 = {
                    scale: channel_1.X,
                    value: 0
                };
                p.orient = { value: 'horizontal' };
            }
        }
        else if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            p.x = { value: 0 };
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_start'
            };
            p.y2 = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y)
            };
            p.y2 = {
                scale: channel_1.Y,
                value: 0
            };
        }
        else if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { field: { group: 'height' } };
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else if (!model.has(channel_1.COLOR)) {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.config('marks').opacity;
        if (opacity) {
            p.opacity = { value: opacity };
        }
        return p;
    }
    properties.area = area;
    function tick(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
            if (model.isDimension(channel_1.X)) {
                p.x.offset = -model.fieldDef(channel_1.X).scale.bandWidth / 3;
            }
        }
        else if (!model.has(channel_1.X)) {
            p.x = { value: 0 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
            if (model.isDimension(channel_1.Y)) {
                p.y.offset = -model.fieldDef(channel_1.Y).scale.bandWidth / 3;
            }
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: 0 };
        }
        if (!model.has(channel_1.X) || model.isDimension(channel_1.X)) {
            p.width = { value: model.fieldDef(channel_1.X).scale.bandWidth / 1.5 };
        }
        else {
            p.width = { value: 1 };
        }
        if (!model.has(channel_1.Y) || model.isDimension(channel_1.Y)) {
            p.height = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 1.5 };
        }
        else {
            p.height = { value: 1 };
        }
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: channel_1.COLOR,
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        var opacity = model.config('marks').opacity;
        if (opacity) {
            p.opacity = { value: opacity };
        }
        return p;
    }
    properties.tick = tick;
    function filled_point_props(shape) {
        return function (model) {
            var p = {};
            if (model.has(channel_1.X)) {
                p.x = {
                    scale: channel_1.X,
                    field: model.field(channel_1.X, { binSuffix: '_mid' })
                };
            }
            else if (!model.has(channel_1.X)) {
                p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
            }
            if (model.has(channel_1.Y)) {
                p.y = {
                    scale: channel_1.Y,
                    field: model.field(channel_1.Y, { binSuffix: '_mid' })
                };
            }
            else if (!model.has(channel_1.Y)) {
                p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
            }
            if (model.has(channel_1.SIZE)) {
                p.size = {
                    scale: channel_1.SIZE,
                    field: model.field(channel_1.SIZE)
                };
            }
            else if (!model.has(channel_1.X)) {
                p.size = { value: model.fieldDef(channel_1.SIZE).value };
            }
            p.shape = { value: shape };
            if (model.has(channel_1.COLOR)) {
                p.fill = {
                    scale: channel_1.COLOR,
                    field: model.field(channel_1.COLOR)
                };
            }
            else if (!model.has(channel_1.COLOR)) {
                p.fill = { value: model.fieldDef(channel_1.COLOR).value };
            }
            var opacity = model.config('marks').opacity;
            if (opacity) {
                p.opacity = { value: opacity };
            }
            return p;
        };
    }
    properties.circle = filled_point_props('circle');
    properties.square = filled_point_props('square');
    function textBackground(model) {
        return {
            x: { value: 0 },
            y: { value: 0 },
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } },
            fill: { scale: channel_1.COLOR, field: model.field(channel_1.COLOR) }
        };
    }
    properties.textBackground = textBackground;
    function text(model) {
        var p = {};
        var fieldDef = model.fieldDef(channel_1.TEXT);
        var marksConfig = model.config('marks');
        if (model.has(channel_1.X)) {
            p.x = {
                scale: channel_1.X,
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.X)) {
            if (model.has(channel_1.TEXT) && model.fieldDef(channel_1.TEXT).type === type_1.QUANTITATIVE) {
                p.x = { field: { group: 'width' }, offset: -5 };
            }
            else {
                p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
            }
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: channel_1.Y,
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else if (!model.has(channel_1.Y)) {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.fontSize = {
                scale: channel_1.SIZE,
                field: model.field(channel_1.SIZE)
            };
        }
        else if (!model.has(channel_1.SIZE)) {
            p.fontSize = { value: fieldDef.fontSize };
        }
        var opacity = model.config('marks').opacity;
        if (opacity) {
            p.opacity = { value: opacity };
        }
        if (model.has(channel_1.TEXT)) {
            if (model.fieldDef(channel_1.TEXT).type === type_1.QUANTITATIVE) {
                var numberFormat = marksConfig.format !== undefined ?
                    marksConfig.format : model.numberFormat(channel_1.TEXT);
                p.text = { template: '{{' + model.field(channel_1.TEXT, { datum: true }) +
                        ' | number:\'' + numberFormat + '\'}}' };
            }
            else {
                p.text = { field: model.field(channel_1.TEXT) };
            }
        }
        else {
            p.text = { value: fieldDef.value };
        }
        ['align', 'baseline', 'fill', 'font', 'fontWeight', 'fontStyle']
            .forEach(function (property) {
            var value = marksConfig[property];
            if (value !== undefined) {
                p[property] = { value: value };
            }
        });
        return p;
    }
    properties.text = text;
})(properties = exports.properties || (exports.properties = {}));
},{"../channel":11,"../marktype":26,"../type":42,"./stack":21}],20:[function(require,module,exports){
var util_1 = require('../util');
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var data_1 = require('../data');
var time = require('./time');
var type_1 = require('../type');
function compileScales(names, model) {
    return names.reduce(function (a, channel) {
        var scaleDef = {
            name: channel,
            type: type(channel, model),
        };
        scaleDef.domain = domain(model, channel, scaleDef.type);
        util_1.extend(scaleDef, rangeMixins(model, channel, scaleDef.type));
        [
            'reverse', 'round',
            'clamp', 'nice',
            'exponent', 'zero',
            'bandWidth', 'outerPadding', 'padding', 'points'
        ].forEach(function (property) {
            var value = exports[property](model, channel, scaleDef.type);
            if (value !== undefined) {
                scaleDef[property] = value;
            }
        });
        return (a.push(scaleDef), a);
    }, []);
}
exports.compileScales = compileScales;
function type(channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return 'ordinal';
        case type_1.ORDINAL:
            var range = fieldDef.scale.range;
            return channel === channel_1.COLOR && (typeof range !== 'string') ? 'linear' : 'ordinal';
        case type_1.TEMPORAL:
            return fieldDef.timeUnit ? time.scale.type(fieldDef.timeUnit, channel) : 'time';
        case type_1.QUANTITATIVE:
            if (model.bin(channel)) {
                return channel === channel_1.ROW || channel === channel_1.COLUMN || channel === channel_1.SHAPE ? 'ordinal' : 'linear';
            }
            return fieldDef.scale.type;
    }
}
exports.type = type;
function domain(model, channel, type) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.scale.domain) {
        return fieldDef.scale.domain;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        var range = time.scale.domain(fieldDef.timeUnit, channel);
        if (range)
            return range;
    }
    var stack = model.stack();
    if (stack && channel === stack.fieldChannel) {
        var facet = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
        return {
            data: data_1.STACKED,
            field: model.field(channel, {
                prefn: (facet ? 'max_' : '') + 'sum_'
            })
        };
    }
    var useRawDomain = _useRawDomain(model, channel);
    var sort = domainSort(model, channel, type);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        return {
            data: model.dataTable(),
            field: type === 'ordinal' ?
                model.field(channel, { binSuffix: '_start' }) :
                [
                    model.field(channel, { binSuffix: '_start' }),
                    model.field(channel, { binSuffix: '_end' })
                ]
        };
    }
    else if (sort) {
        return {
            data: sort.op ? data_1.SOURCE : model.dataTable(),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: model.field(channel)
        };
    }
}
exports.domain = domain;
function domainSort(model, channel, type) {
    var sort = model.fieldDef(channel).sort;
    if (sort === 'ascending' || sort === 'descending') {
        return true;
    }
    if (type === 'ordinal' && typeof sort !== 'string') {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    return undefined;
}
exports.domainSort = domainSort;
function reverse(model, channel) {
    var sort = model.fieldDef(channel).sort;
    return sort && (typeof sort === 'string' ?
        sort === 'descending' :
        sort.order === 'descending') ? true : undefined;
}
exports.reverse = reverse;
function _useRawDomain(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return fieldDef.scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin) ||
            (fieldDef.type === type_1.TEMPORAL &&
                (!fieldDef.timeUnit || time.scale.type(fieldDef.timeUnit, channel) === 'linear')));
}
exports._useRawDomain = _useRawDomain;
function bandWidth(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        return model.fieldDef(channel).scale.bandWidth;
    }
    return undefined;
}
exports.bandWidth = bandWidth;
function clamp(model, channel) {
    return model.fieldDef(channel).scale.clamp;
}
exports.clamp = clamp;
function exponent(model, channel) {
    return model.fieldDef(channel).scale.exponent;
}
exports.exponent = exponent;
function nice(model, channel, scaleType) {
    if (model.fieldDef(channel).scale.nice !== undefined) {
        return model.fieldDef(channel).scale.nice;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
            if (scaleType === 'time' || scaleType === 'ordinal') {
                return undefined;
            }
            return true;
        case channel_1.ROW:
        case channel_1.COLUMN:
            return true;
    }
    return undefined;
}
exports.nice = nice;
function outerPadding(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        if (model.fieldDef(channel).scale.outerPadding !== undefined) {
            return model.fieldDef(channel).scale.outerPadding;
        }
    }
    return undefined;
}
exports.outerPadding = outerPadding;
function padding(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        return model.fieldDef(channel).scale.padding;
    }
    return undefined;
}
exports.padding = padding;
function points(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        if (model.fieldDef(channel).scale.points !== undefined) {
            return model.fieldDef(channel).scale.points;
        }
        switch (channel) {
            case channel_1.X:
            case channel_1.Y:
                return true;
        }
    }
    return undefined;
}
exports.points = points;
function rangeMixins(model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.scale.range) {
        return { range: fieldDef.scale.range };
    }
    switch (channel) {
        case channel_1.X:
            return { rangeMin: 0, rangeMax: model.layout().cellWidth };
        case channel_1.Y:
            if (scaleType === 'ordinal') {
                return { rangeMin: 0, rangeMax: model.layout().cellHeight };
            }
            return { rangeMin: model.layout().cellHeight, rangeMax: 0 };
        case channel_1.SIZE:
            if (model.is('bar')) {
                return {
                    range: [3, Math.max(model.fieldDef(channel_1.X).scale.bandWidth, model.fieldDef(channel_1.Y).scale.bandWidth)]
                };
            }
            else if (model.is(channel_1.TEXT)) {
                return { range: [8, 40] };
            }
            var bandWidth = Math.min(model.fieldDef(channel_1.X).scale.bandWidth, model.fieldDef(channel_1.Y).scale.bandWidth) - 1;
            return { range: [10, 0.8 * bandWidth * bandWidth] };
        case channel_1.SHAPE:
            return { range: 'shapes' };
        case channel_1.COLOR:
            if (scaleType === 'ordinal') {
                return { range: 'category10' };
            }
            else {
                return { range: ['#AFC6A3', '#09622A'] };
            }
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function round(model, channel) {
    if (model.fieldDef(channel).scale.round !== undefined) {
        return model.fieldDef(channel).scale.round;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
            return true;
    }
    return undefined;
}
exports.round = round;
function zero(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.scale.zero !== undefined) {
        return fieldDef.scale.zero;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (timeUnit === 'year') {
            return false;
        }
        return undefined;
    }
    if (fieldDef.bin) {
        return false;
    }
    return channel === channel_1.X || channel === channel_1.Y ?
        undefined :
        false;
}
exports.zero = zero;
},{"../aggregate":9,"../channel":11,"../data":23,"../type":42,"../util":43,"./time":22}],21:[function(require,module,exports){
var util_1 = require('../util');
function imputeTransform(model) {
    var stack = model.stack();
    return {
        type: 'impute',
        field: model.field(stack.fieldChannel),
        groupby: [model.field(stack.stackChannel)],
        orderby: [model.field(stack.groupbyChannel)],
        method: 'value',
        value: 0
    };
}
exports.imputeTransform = imputeTransform;
function stackTransform(model) {
    var stack = model.stack();
    var sortby = stack.config.sort === 'descending' ?
        '-' + model.field(stack.stackChannel) :
        stack.config.sort === 'ascending' ?
            model.field(stack.stackChannel) :
            util_1.isObject(stack.config.sort) ?
                stack.config.sort :
                '-' + model.field(stack.stackChannel);
    var valName = model.field(stack.fieldChannel);
    var transform = {
        type: 'stack',
        groupby: [model.field(stack.groupbyChannel)],
        field: model.field(stack.fieldChannel),
        sortby: sortby,
        output: {
            start: valName + '_start',
            end: valName + '_end'
        }
    };
    if (stack.config.offset) {
        transform.offset = stack.config.offset;
    }
    return transform;
}
exports.stackTransform = stackTransform;
},{"../util":43}],22:[function(require,module,exports){
var util = require('../util');
var channel_1 = require('../channel');
function cardinality(fieldDef, stats, filterNull, type) {
    var timeUnit = fieldDef.timeUnit;
    switch (timeUnit) {
        case 'seconds': return 60;
        case 'minutes': return 60;
        case 'hours': return 24;
        case 'day': return 7;
        case 'date': return 31;
        case 'month': return 12;
        case 'year':
            var stat = stats[fieldDef.field], yearstat = stats['year_' + fieldDef.field];
            if (!yearstat) {
                return null;
            }
            return yearstat.distinct -
                (stat.missing > 0 && filterNull[type] ? 1 : 0);
    }
    return null;
}
exports.cardinality = cardinality;
function formula(timeUnit, field) {
    var fn = 'utc' + timeUnit;
    return fn + '(' + field + ')';
}
exports.formula = formula;
function range(timeUnit, model) {
    var labelLength = model.config('timeScaleLabelLength'), scaleLabel;
    switch (timeUnit) {
        case 'day':
            scaleLabel = model.config('dayScaleLabel');
            break;
        case 'month':
            scaleLabel = model.config('monthScaleLabel');
            break;
    }
    if (scaleLabel) {
        return labelLength ? scaleLabel.map(function (s) { return s.substr(0, labelLength); }) : scaleLabel;
    }
    return;
}
exports.range = range;
function isOrdinalFn(timeUnit) {
    switch (timeUnit) {
        case 'seconds':
        case 'minutes':
        case 'hours':
        case 'day':
        case 'date':
        case 'month':
            return true;
    }
    return false;
}
var scale;
(function (scale) {
    function type(timeUnit, channel) {
        if (channel === channel_1.COLOR) {
            return 'linear';
        }
        return isOrdinalFn(timeUnit) || channel === channel_1.COLUMN || channel === channel_1.ROW ? 'ordinal' : 'linear';
    }
    scale.type = type;
    function domain(timeUnit, channel) {
        var isColor = channel === channel_1.COLOR;
        switch (timeUnit) {
            case 'seconds':
            case 'minutes': return isColor ? [0, 59] : util.range(0, 60);
            case 'hours': return isColor ? [0, 23] : util.range(0, 24);
            case 'day': return isColor ? [0, 6] : util.range(0, 7);
            case 'date': return isColor ? [1, 31] : util.range(1, 32);
            case 'month': return isColor ? [0, 11] : util.range(0, 12);
        }
        return null;
    }
    scale.domain = domain;
})(scale = exports.scale || (exports.scale = {}));
function labelTemplate(timeUnit, abbreviated) {
    if (abbreviated === void 0) { abbreviated = false; }
    var postfix = abbreviated ? '-abbrev' : '';
    switch (timeUnit) {
        case 'day':
            return 'day' + postfix;
        case 'month':
            return 'month' + postfix;
    }
    return null;
}
exports.labelTemplate = labelTemplate;
},{"../channel":11,"../util":43}],23:[function(require,module,exports){
var type_1 = require('./type');
exports.SUMMARY = 'summary';
exports.SOURCE = 'source';
exports.STACKED = 'stacked';
exports.LAYOUT = 'layout';
exports.types = {
    'boolean': type_1.NOMINAL,
    'number': type_1.QUANTITATIVE,
    'integer': type_1.QUANTITATIVE,
    'date': type_1.TEMPORAL,
    'string': type_1.NOMINAL
};
},{"./type":42}],24:[function(require,module,exports){
var channel_1 = require('./channel');
function countRetinal(encoding) {
    var count = 0;
    if (encoding.color)
        count++;
    if (encoding.size)
        count++;
    if (encoding.shape)
        count++;
    return count;
}
exports.countRetinal = countRetinal;
function has(encoding, channel) {
    var fieldDef = encoding && encoding[channel];
    return fieldDef && fieldDef.field;
}
exports.has = has;
function isAggregate(encoding) {
    for (var k in encoding) {
        if (has(encoding, k) && encoding[k].aggregate) {
            return true;
        }
    }
    return false;
}
exports.isAggregate = isAggregate;
function forEach(encoding, f) {
    var i = 0;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            f(encoding[channel], channel, i++);
        }
    });
}
exports.forEach = forEach;
function map(encoding, f) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (k) {
        if (has(encoding, k)) {
            arr.push(f(encoding[k], k, encoding));
        }
    });
    return arr;
}
exports.map = map;
function reduce(encoding, f, init) {
    var r = init;
    channel_1.CHANNELS.forEach(function (k) {
        if (has(encoding, k)) {
            r = f(r, encoding[k], k, encoding);
        }
    });
    return r;
}
exports.reduce = reduce;
},{"./channel":11}],25:[function(require,module,exports){
var bin_1 = require('./bin');
var util_1 = require('./util');
var time = require('./compiler/time');
var type_1 = require('./type');
function _isFieldDimension(fieldDef) {
    return util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin ||
        (fieldDef.type === type_1.TEMPORAL && !!fieldDef.timeUnit);
}
function isDimension(fieldDef) {
    return fieldDef && _isFieldDimension(fieldDef);
}
exports.isDimension = isDimension;
function isMeasure(fieldDef) {
    return fieldDef && !_isFieldDimension(fieldDef);
}
exports.isMeasure = isMeasure;
function count() {
    return { field: '*', aggregate: 'count', type: type_1.QUANTITATIVE, displayName: exports.COUNT_DISPLAYNAME };
}
exports.count = count;
exports.COUNT_DISPLAYNAME = 'Number of Records';
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function cardinality(fieldDef, stats, filterNull) {
    if (filterNull === void 0) { filterNull = {}; }
    var stat = stats[fieldDef.field];
    var type = fieldDef.type;
    if (fieldDef.bin) {
        var bin = fieldDef.bin;
        var maxbins = (typeof bin === 'boolean') ? bin_1.MAXBINS_DEFAULT : bin.maxbins;
        var bins = util_1.getbins(stat, maxbins);
        return (bins.stop - bins.start) / bins.step;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        var cardinality = time.cardinality(fieldDef, stats, filterNull, type);
        if (cardinality !== null)
            return cardinality;
    }
    if (fieldDef.aggregate) {
        return 1;
    }
    return stat.distinct -
        (stat.missing > 0 && filterNull[type] ? 1 : 0);
}
exports.cardinality = cardinality;
},{"./bin":10,"./compiler/time":22,"./type":42,"./util":43}],26:[function(require,module,exports){
exports.AREA = 'area';
exports.BAR = 'bar';
exports.LINE = 'line';
exports.POINT = 'point';
exports.TEXT = 'text';
exports.TICK = 'tick';
exports.CIRCLE = 'circle';
exports.SQUARE = 'square';
},{}],27:[function(require,module,exports){
exports.axis = {
    type: 'object',
    properties: {
        format: {
            type: 'string',
            default: undefined,
            description: 'The formatting pattern for axis labels. ' +
                'If not undefined, this will be determined by ' +
                'the max value ' +
                'of the field.'
        },
        grid: {
            type: 'boolean',
            default: undefined,
            description: 'A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.'
        },
        layer: {
            type: 'string',
            default: undefined,
            description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks.'
        },
        orient: {
            type: 'string',
            default: undefined,
            enum: ['top', 'right', 'left', 'bottom'],
            description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
        },
        ticks: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
        },
        title: {
            type: 'string',
            default: undefined,
            description: 'A title for the axis. (Shows field name and its function by default.)'
        },
        labelMaxLength: {
            type: 'integer',
            default: 25,
            minimum: 0,
            description: 'Truncate labels that are too long.'
        },
        titleMaxLength: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'Max length for axis title if the title is automatically generated from the field\'s description'
        },
        titleOffset: {
            type: 'integer',
            default: undefined,
            description: 'A title offset value for the axis.'
        },
        shortTimeNames: {
            type: 'boolean',
            default: false,
            description: 'Whether month names and weekday names should be abbreviated.'
        },
        properties: {
            type: 'object',
            default: undefined,
            description: 'Optional mark property definitions for custom axis styling.'
        }
    }
};
},{}],28:[function(require,module,exports){
var bin_1 = require('../bin');
var type_1 = require('../type');
var util_1 = require('../util');
exports.bin = {
    type: ['boolean', 'object'],
    default: false,
    properties: {
        maxbins: {
            type: 'integer',
            default: bin_1.MAXBINS_DEFAULT,
            minimum: 2,
            description: 'Maximum number of bins.'
        }
    },
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE])
};
},{"../bin":10,"../type":42,"../util":43}],29:[function(require,module,exports){
exports.config = {
    type: 'object',
    properties: {
        width: {
            type: 'integer',
            default: undefined
        },
        height: {
            type: 'integer',
            default: undefined
        },
        viewport: {
            type: 'array',
            items: {
                type: 'integer'
            },
            default: undefined
        },
        filterNull: {
            type: 'object',
            properties: {
                nominal: { type: 'boolean', default: false },
                ordinal: { type: 'boolean', default: false },
                quantitative: { type: 'boolean', default: true },
                temporal: { type: 'boolean', default: true }
            }
        },
        textCellWidth: {
            type: 'integer',
            default: 90,
            minimum: 0
        },
        sortLineBy: {
            type: 'string',
            default: undefined,
            description: 'Data field to sort line by. ' +
                '\'-\' prefix can be added to suggest descending order.'
        },
        stack: {
            type: ['boolean', 'object'],
            default: {},
            description: 'Enable stacking (for bar and area marks only).',
            properties: {
                sort: {
                    oneOf: [{
                            type: 'string',
                            enum: ['ascending', 'descending']
                        }, {
                            type: 'array',
                            items: { type: 'string' },
                        }],
                    description: 'Order of the stack. ' +
                        'This can be either a string (either "descending" or "ascending")' +
                        'or a list of fields to determine the order of stack layers.' +
                        'By default, stack uses descending order.'
                },
                offset: {
                    type: 'string',
                    enum: ['zero', 'center', 'normalize']
                }
            }
        },
        cell: {
            type: 'object',
            properties: {
                width: {
                    type: 'integer',
                    default: 200
                },
                height: {
                    type: 'integer',
                    default: 200
                },
                padding: {
                    type: 'integer',
                    default: 16,
                    description: 'default padding between facets.'
                },
                gridColor: {
                    type: 'string',
                    role: 'color',
                    default: '#000000'
                },
                gridOpacity: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    default: 0.25
                },
                gridOffset: {
                    type: 'number',
                    default: 6
                },
                fill: {
                    type: 'string',
                    role: 'color',
                    default: 'rgba(0,0,0,0)'
                },
                fillOpacity: {
                    type: 'number',
                },
                stroke: {
                    type: 'string',
                    role: 'color',
                },
                strokeWidth: {
                    type: 'integer'
                },
                strokeOpacity: {
                    type: 'number'
                },
                strokeDash: {
                    type: 'array',
                    default: undefined
                },
                strokeDashOffset: {
                    type: 'integer',
                    description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
                }
            }
        },
        marks: {
            type: 'object',
            properties: {
                filled: {
                    type: 'boolean',
                    default: false,
                    description: 'Whether the shape\'s color should be used as fill color instead of stroke color.'
                },
                format: {
                    type: 'string',
                    default: '',
                    description: 'The formatting pattern for text value.' +
                        'If not defined, this will be determined automatically'
                },
                opacity: {
                    type: 'number',
                    default: undefined,
                    minimum: 0,
                    maximum: 1
                },
                strokeWidth: {
                    type: 'integer',
                    default: 2,
                    minimum: 0
                },
                align: {
                    type: 'string',
                    default: 'right',
                    enum: ['left', 'right', 'center'],
                    description: 'The horizontal alignment of the text. One of left, right, center.'
                },
                baseline: {
                    type: 'string',
                    default: 'middle',
                    enum: ['top', 'middle', 'bottom'],
                    description: 'The vertical alignment of the text. One of top, middle, bottom.'
                },
                fill: {
                    type: 'string',
                    role: 'color',
                    default: '#000000'
                },
                font: {
                    type: 'string',
                    default: undefined,
                    role: 'font',
                    description: 'The typeface to set the text in (e.g., Helvetica Neue).'
                },
                fontSize: {
                    type: 'integer',
                    default: undefined,
                    minimum: 0,
                    description: 'The font size, in pixels.'
                },
                fontStyle: {
                    type: 'string',
                    default: undefined,
                    enum: ['normal', 'italic'],
                    description: 'The font style (e.g., italic).'
                },
                fontWeight: {
                    type: 'string',
                    enum: ['normal', 'bold'],
                    default: undefined,
                    description: 'The font weight (e.g., bold).'
                }
            }
        },
        singleBarOffset: {
            type: 'integer',
            default: 5,
            minimum: 0
        },
        characterWidth: {
            type: 'integer',
            default: 6
        },
        numberFormat: {
            type: 'string',
            default: 's',
            description: 'D3 Number format for axis labels and text tables.'
        },
        timeFormat: {
            type: 'string',
            default: '%Y-%m-%d',
            description: 'Date format for axis labels.'
        }
    }
};
},{}],30:[function(require,module,exports){
exports.data = {
    type: 'object',
    properties: {
        formatType: {
            type: 'string',
            enum: ['json', 'csv', 'tsv'],
            default: 'json'
        },
        url: {
            type: 'string',
            default: undefined
        },
        values: {
            type: 'array',
            default: undefined,
            description: 'Pass array of objects instead of a url to a file.',
            items: {
                type: 'object',
                additionalProperties: true
            }
        },
        filter: {
            type: 'string',
            default: undefined,
            description: 'A string containing the filter Vega expression. Use `datum` to refer to the current data object.'
        },
        calculate: {
            type: 'array',
            default: undefined,
            description: 'Calculate new field(s) using the provided expresssion(s). Calculation are applied before filter.',
            items: {
                type: 'object',
                properties: {
                    field: {
                        type: 'string',
                        description: 'The field in which to store the computed formula value.'
                    },
                    expr: {
                        type: 'string',
                        description: 'A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object.'
                    }
                }
            }
        }
    }
};
},{}],31:[function(require,module,exports){
var schemautil_1 = require('./schemautil');
var util_1 = require('../util');
var axis_schema_1 = require('./axis.schema');
var legend_schema_1 = require('./legend.schema');
var sort_schema_1 = require('./sort.schema');
var fielddef_schema_1 = require('./fielddef.schema');
var requiredNameType = {
    required: ['field', 'type']
};
var x = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), requiredNameType, {
    properties: {
        scale: {
            properties: {
                padding: { default: 1 },
                bandWidth: { default: 21 }
            }
        },
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});
var y = util_1.duplicate(x);
var facet = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), requiredNameType, {
    properties: {
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});
var row = schemautil_1.merge(util_1.duplicate(facet));
var column = schemautil_1.merge(util_1.duplicate(facet));
var size = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'integer',
            default: 30,
            minimum: 0,
            description: 'Size of marks.'
        }
    }
});
var color = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            role: 'color',
            default: '#4682b4',
            description: 'Color to be used for marks.'
        },
        scale: {
            type: 'object',
            properties: {
                quantitativeRange: {
                    type: 'array',
                    default: ['#AFC6A3', '#09622A'],
                    description: 'Color range to encode quantitative variables.',
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: 'string',
                        role: 'color'
                    }
                }
            }
        }
    }
});
var shape = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
            default: 'circle',
            description: 'Mark to be used.'
        }
    }
});
var detail = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), {
    properties: {
        sort: sort_schema_1.sort
    }
});
var text = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            default: 'Abc'
        }
    }
});
exports.encoding = {
    type: 'object',
    properties: {
        x: x,
        y: y,
        row: row,
        column: column,
        size: size,
        color: color,
        shape: shape,
        text: text,
        detail: detail
    }
};
},{"../util":43,"./axis.schema":27,"./fielddef.schema":32,"./legend.schema":33,"./schemautil":37,"./sort.schema":38}],32:[function(require,module,exports){
var bin_schema_1 = require('./bin.schema');
var scale_schema_1 = require('./scale.schema');
var aggregate_1 = require('../aggregate');
var util_1 = require('../util');
var schemautil_1 = require('./schemautil');
var timeunit_1 = require('../timeunit');
var type_1 = require('../type');
exports.fieldDef = {
    type: 'object',
    properties: {
        field: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: [type_1.NOMINAL, type_1.ORDINAL, type_1.QUANTITATIVE, type_1.TEMPORAL]
        },
        timeUnit: {
            type: 'string',
            enum: timeunit_1.TIMEUNITS,
            supportedTypes: util_1.toMap([type_1.TEMPORAL])
        },
        bin: bin_schema_1.bin,
    }
};
exports.aggregate = {
    type: 'string',
    enum: aggregate_1.AGGREGATE_OPS,
    supportedEnums: {
        quantitative: aggregate_1.AGGREGATE_OPS,
        ordinal: ['median', 'min', 'max'],
        nominal: [],
        temporal: ['mean', 'median', 'min', 'max'],
        '': ['count']
    },
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.NOMINAL, type_1.ORDINAL, type_1.TEMPORAL, ''])
};
exports.typicalField = schemautil_1.merge(util_1.duplicate(exports.fieldDef), {
    properties: {
        aggregate: exports.aggregate,
        scale: scale_schema_1.typicalScale
    }
});
exports.onlyOrdinalField = schemautil_1.merge(util_1.duplicate(exports.fieldDef), {
    properties: {
        aggregate: {
            type: 'string',
            enum: ['count'],
            supportedTypes: util_1.toMap([type_1.NOMINAL, type_1.ORDINAL])
        },
        scale: scale_schema_1.ordinalOnlyScale
    }
});
},{"../aggregate":9,"../timeunit":41,"../type":42,"../util":43,"./bin.schema":28,"./scale.schema":35,"./schemautil":37}],33:[function(require,module,exports){
exports.legend = {
    default: true,
    description: 'Properties of a legend or boolean flag for determining whether to show it.',
    oneOf: [{
            type: 'object',
            properties: {
                orient: {
                    type: 'string',
                    default: undefined,
                    description: 'The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".'
                },
                title: {
                    type: 'string',
                    default: undefined,
                    description: 'A title for the legend. (Shows field name and its function by default.)'
                },
                format: {
                    type: 'string',
                    default: undefined,
                    description: 'An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.'
                },
                values: {
                    type: 'array',
                    default: undefined,
                    description: 'Explicitly set the visible legend values.'
                },
                properties: {
                    type: 'object',
                    default: undefined,
                    description: 'Optional mark property definitions for custom legend styling. '
                }
            }
        }, {
            type: 'boolean'
        }]
};
},{}],34:[function(require,module,exports){
exports.marktype = {
    type: 'string',
    enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};
},{}],35:[function(require,module,exports){
var util_1 = require('../util');
var schemautil_1 = require('./schemautil');
var type_1 = require('../type');
var scale = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['linear', 'log', 'pow', 'sqrt', 'quantile'],
            default: 'linear',
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE])
        },
        domain: {
            default: undefined,
            type: ['array', 'object'],
            description: 'The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. The domain may also be specified by a reference to a data source.'
        },
        range: {
            default: undefined,
            type: ['array', 'object', 'string'],
            description: 'The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. For ordinal scales only, the range can be defined using a DataRef: the range values are then drawn dynamically from a backing data set.'
        },
        round: {
            default: undefined,
            type: 'boolean',
            description: 'If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.'
        }
    }
};
var ordinalScaleMixin = {
    properties: {
        bandWidth: {
            type: 'integer',
            minimum: 0,
            default: undefined
        },
        outerPadding: {
            type: 'number',
            default: undefined
        },
        padding: {
            type: 'number',
            default: undefined,
            description: 'Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).'
        },
        points: {
            type: 'boolean',
            default: undefined,
            description: 'If true, distributes the ordinal values over a quantitative range at uniformly spaced points. The spacing of the points can be adjusted using the padding property. If false, the ordinal scale will construct evenly-spaced bands, rather than points.'
        }
    }
};
var typicalScaleMixin = {
    properties: {
        clamp: {
            type: 'boolean',
            default: true,
            description: 'If true, values that exceed the data domain are clamped to either the minimum or maximum range value'
        },
        nice: {
            default: undefined,
            oneOf: [
                {
                    type: 'boolean',
                    description: 'If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).'
                }, {
                    type: 'string',
                    enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
                    description: 'If specified, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval; legal values are "second", "minute", "hour", "day", "week", "month", or "year".'
                }
            ],
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.TEMPORAL]),
            description: ''
        },
        exponent: {
            type: 'number',
            default: undefined,
            description: 'Sets the exponent of the scale transformation. For pow scale types only, otherwise ignored.'
        },
        zero: {
            type: 'boolean',
            description: 'If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.',
            default: undefined,
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.TEMPORAL])
        },
        useRawDomain: {
            type: 'boolean',
            default: false,
            description: 'Uses the source data range as scale domain instead of ' +
                'aggregated data for aggregate axis. ' +
                'This option does not work with sum or count aggregate' +
                'as they might have a substantially larger scale range.'
        }
    }
};
exports.ordinalOnlyScale = schemautil_1.merge(util_1.duplicate(scale), ordinalScaleMixin);
exports.typicalScale = schemautil_1.merge(util_1.duplicate(scale), ordinalScaleMixin, typicalScaleMixin);
},{"../type":42,"../util":43,"./schemautil":37}],36:[function(require,module,exports){
var schemaUtil = require('./schemautil');
var marktype_schema_1 = require('./marktype.schema');
var config_schema_1 = require('./config.schema');
var data_schema_1 = require('./data.schema');
var encoding_schema_1 = require('./encoding.schema');
var fielddef_schema_1 = require('./fielddef.schema');
exports.aggregate = fielddef_schema_1.aggregate;
exports.util = schemaUtil;
exports.schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Schema for Vega-lite specification',
    type: 'object',
    required: ['marktype', 'encoding'],
    properties: {
        data: data_schema_1.data,
        marktype: marktype_schema_1.marktype,
        encoding: encoding_schema_1.encoding,
        config: config_schema_1.config
    }
};
function instantiate() {
    return schemaUtil.instantiate(exports.schema);
}
exports.instantiate = instantiate;
;
},{"./config.schema":29,"./data.schema":30,"./encoding.schema":31,"./fielddef.schema":32,"./marktype.schema":34,"./schemautil":37}],37:[function(require,module,exports){
var util = require('../util');
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
;
function extend(instance, schema) {
    return merge(instantiate(schema), instance);
}
exports.extend = extend;
;
function instantiate(schema) {
    var val;
    if (schema === undefined) {
        return undefined;
    }
    else if ('default' in schema) {
        val = schema.default;
        return util.isObject(val) ? util.duplicate(val) : val;
    }
    else if (schema.type === 'object') {
        var instance = {};
        for (var name in schema.properties) {
            val = instantiate(schema.properties[name]);
            if (val !== undefined) {
                instance[name] = val;
            }
        }
        return instance;
    }
    else if (schema.type === 'array') {
        return undefined;
    }
    return undefined;
}
exports.instantiate = instantiate;
;
function subtract(instance, defaults) {
    var changes = {};
    for (var prop in instance) {
        var def = defaults[prop];
        var ins = instance[prop];
        if (!defaults || def !== ins) {
            if (typeof ins === 'object' && !util.isArray(ins) && def) {
                var c = subtract(ins, def);
                if (!isEmpty(c)) {
                    changes[prop] = c;
                }
            }
            else if (util.isArray(ins)) {
                if (util.isArray(def)) {
                    if (ins.length === def.length) {
                        var equal = true;
                        for (var i = 0; i < ins.length; i++) {
                            if (ins[i] !== def[i]) {
                                equal = false;
                                break;
                            }
                        }
                        if (equal) {
                            continue;
                        }
                    }
                }
                changes[prop] = ins;
            }
            else {
                changes[prop] = ins;
            }
        }
    }
    return changes;
}
exports.subtract = subtract;
;
function merge(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < src.length; i++) {
        dest = merge_(dest, src[i]);
    }
    return dest;
}
exports.merge = merge;
;
function merge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = merge(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            merge(dest[p], src[p]);
        }
    }
    return dest;
}
},{"../util":43}],38:[function(require,module,exports){
var aggregate_1 = require('../aggregate');
var type_1 = require('../type');
var util_1 = require('../util');
exports.sort = {
    default: 'ascending',
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.ORDINAL]),
    oneOf: [
        {
            type: 'string',
            enum: ['ascending', 'descending', 'unsorted']
        },
        {
            type: 'object',
            required: ['field', 'op'],
            properties: {
                field: {
                    type: 'string',
                    description: 'The field name to aggregate over.'
                },
                op: {
                    type: 'string',
                    enum: aggregate_1.AGGREGATE_OPS,
                    description: 'The field name to aggregate over.'
                },
                order: {
                    type: 'string',
                    enum: ['ascending', 'descending']
                }
            }
        }
    ]
};
},{"../aggregate":9,"../type":42,"../util":43}],39:[function(require,module,exports){
var aggregate_1 = require('./aggregate');
var timeunit_1 = require('./timeunit');
var type_1 = require('./type');
var vlEncoding = require('./encoding');
exports.DELIM = '|';
exports.ASSIGN = '=';
exports.TYPE = ',';
exports.FUNC = '_';
function shorten(spec) {
    return 'mark' + exports.ASSIGN + spec.marktype +
        exports.DELIM + shortenEncoding(spec.encoding);
}
exports.shorten = shorten;
function parse(shorthand, data, config) {
    var split = shorthand.split(exports.DELIM), marktype = split.shift().split(exports.ASSIGN)[1].trim(), encoding = parseEncoding(split.join(exports.DELIM));
    var spec = {
        marktype: marktype,
        encoding: encoding
    };
    if (data !== undefined) {
        spec.data = data;
    }
    if (config !== undefined) {
        spec.config = config;
    }
    return spec;
}
exports.parse = parse;
function shortenEncoding(encoding) {
    return vlEncoding.map(encoding, function (fieldDef, channel) {
        return channel + exports.ASSIGN + shortenFieldDef(fieldDef);
    }).join(exports.DELIM);
}
exports.shortenEncoding = shortenEncoding;
function parseEncoding(encodingShorthand) {
    return encodingShorthand.split(exports.DELIM).reduce(function (m, e) {
        var split = e.split(exports.ASSIGN), enctype = split[0].trim(), fieldDefShorthand = split[1];
        m[enctype] = parseFieldDef(fieldDefShorthand);
        return m;
    }, {});
}
exports.parseEncoding = parseEncoding;
function shortenFieldDef(fieldDef) {
    return (fieldDef.aggregate ? fieldDef.aggregate + exports.FUNC : '') +
        (fieldDef.timeUnit ? fieldDef.timeUnit + exports.FUNC : '') +
        (fieldDef.bin ? 'bin' + exports.FUNC : '') +
        (fieldDef.field || '') + exports.TYPE + type_1.SHORT_TYPE[fieldDef.type];
}
exports.shortenFieldDef = shortenFieldDef;
function shortenFieldDefs(fieldDefs, delim) {
    if (delim === void 0) { delim = exports.DELIM; }
    return fieldDefs.map(shortenFieldDef).join(delim);
}
exports.shortenFieldDefs = shortenFieldDefs;
function parseFieldDef(fieldDefShorthand) {
    var split = fieldDefShorthand.split(exports.TYPE), i;
    var fieldDef = {
        field: split[0].trim(),
        type: type_1.TYPE_FROM_SHORT_TYPE[split[1].trim()]
    };
    for (i in aggregate_1.AGGREGATE_OPS) {
        var a = aggregate_1.AGGREGATE_OPS[i];
        if (fieldDef.field.indexOf(a + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(a.length + 1);
            if (a === 'count' && fieldDef.field.length === 0)
                fieldDef.field = '*';
            fieldDef.aggregate = a;
            break;
        }
    }
    for (i in timeunit_1.TIMEUNITS) {
        var tu = timeunit_1.TIMEUNITS[i];
        if (fieldDef.field && fieldDef.field.indexOf(tu + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(fieldDef.field.length + 1);
            fieldDef.timeUnit = tu;
            break;
        }
    }
    if (fieldDef.field && fieldDef.field.indexOf('bin_') === 0) {
        fieldDef.field = fieldDef.field.substr(4);
        fieldDef.bin = true;
    }
    return fieldDef;
}
exports.parseFieldDef = parseFieldDef;
},{"./aggregate":9,"./encoding":24,"./timeunit":41,"./type":42}],40:[function(require,module,exports){
var vlEncoding = require('./encoding');
var util_1 = require('./util');
var Model_1 = require('./compiler/Model');
var channel_1 = require('./channel');
var marktype_1 = require('./marktype');
function alwaysNoOcclusion(spec) {
    return vlEncoding.isAggregate(spec.encoding);
}
exports.alwaysNoOcclusion = alwaysNoOcclusion;
function getCleanSpec(spec) {
    return new Model_1.Model(spec).toSpec(true);
}
exports.getCleanSpec = getCleanSpec;
function isStack(spec) {
    return (spec.encoding[channel_1.COLOR].field || spec.encoding[channel_1.DETAIL].field) &&
        (spec.marktype === marktype_1.BAR || spec.marktype === marktype_1.AREA) &&
        (!spec.config || !spec.config.stack !== false) &&
        vlEncoding.isAggregate(spec.encoding);
}
exports.isStack = isStack;
function transpose(spec) {
    var oldenc = spec.encoding, encoding = util_1.duplicate(spec.encoding);
    encoding.x = oldenc.y;
    encoding.y = oldenc.x;
    encoding.row = oldenc.column;
    encoding.column = oldenc.row;
    spec.encoding = encoding;
    return spec;
}
exports.transpose = transpose;
},{"./channel":11,"./compiler/Model":12,"./encoding":24,"./marktype":26,"./util":43}],41:[function(require,module,exports){
exports.TIMEUNITS = [
    'year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'
];
},{}],42:[function(require,module,exports){
exports.QUANTITATIVE = 'quantitative';
exports.ORDINAL = 'ordinal';
exports.TEMPORAL = 'temporal';
exports.NOMINAL = 'nominal';
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
function getFullName(type) {
    return exports.TYPE_FROM_SHORT_TYPE[type.toUpperCase()] ||
        type.toLowerCase();
}
exports.getFullName = getFullName;
},{}],43:[function(require,module,exports){
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('datalib/src/util'));
__export(require('datalib/src/generate'));
__export(require('datalib/src/stats'));
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            f.call(thisArg, obj[k], k, obj);
        }
    }
}
exports.forEach = forEach;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            init = f.call(thisArg, init, obj[k], k, obj);
        }
        return init;
    }
}
exports.reduce = reduce;
function map(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            output.push(f.call(thisArg, obj[k], k, obj));
        }
        return output;
    }
}
exports.map = map;
function any(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (f(arr[k], k, i++))
            return true;
    }
    return false;
}
exports.any = any;
function all(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (!f(arr[k], k, i++))
            return false;
    }
    return true;
}
exports.all = all;
var dlBin = require('datalib/src/bins/bins');
function getbins(stats, maxbins) {
    return dlBin({
        min: stats.min,
        max: stats.max,
        maxbins: maxbins
    });
}
exports.getbins = getbins;
function error(message) {
    console.error('[VL Error]', message);
}
exports.error = error;
},{"datalib/src/bins/bins":3,"datalib/src/generate":4,"datalib/src/stats":6,"datalib/src/util":8}],44:[function(require,module,exports){
var util_1 = require('./util');
exports.DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    area: ['x', 'y']
};
exports.DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: util_1.toMap(['row', 'column', 'x', 'y', 'size', 'color', 'detail']),
    line: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    area: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    tick: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    circle: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    square: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    point: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail', 'shape']),
    text: util_1.toMap(['row', 'column', 'size', 'color', 'text'])
};
function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = exports.DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = exports.DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var marktype = spec.marktype;
    var encoding = spec.encoding;
    var requiredChannels = requiredChannelMap[marktype];
    var supportedChannels = supportedChannelMap[marktype];
    for (var i in requiredChannels) {
        if (!(requiredChannels[i] in encoding)) {
            return 'Missing encoding channel \"' + requiredChannels[i] +
                '\" for marktype \"' + marktype + '\"';
        }
    }
    for (var channel in encoding) {
        if (!supportedChannels[channel]) {
            return 'Encoding channel \"' + channel +
                '\" is not supported by mark type \"' + marktype + '\"';
        }
    }
    if (marktype === 'bar' && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
exports.getEncodingMappingError = getEncodingMappingError;
},{"./util":43}],45:[function(require,module,exports){
var vlBin = require('./bin');
var vlChannel = require('./channel');
var vlData = require('./data');
var vlEncoding = require('./encoding');
var vlFieldDef = require('./fielddef');
var vlCompiler = require('./compiler/compiler');
var vlSchema = require('./schema/schema');
var vlShorthand = require('./shorthand');
var vlSpec = require('./spec');
var vlTimeUnit = require('./timeunit');
var vlType = require('./type');
var vlValidate = require('./validate');
var vlUtil = require('./util');
exports.bin = vlBin;
exports.channel = vlChannel;
exports.compiler = vlCompiler;
exports.compile = vlCompiler.compile;
exports.data = vlData;
exports.encoding = vlEncoding;
exports.fieldDef = vlFieldDef;
exports.schema = vlSchema;
exports.shorthand = vlShorthand;
exports.spec = vlSpec;
exports.timeUnit = vlTimeUnit;
exports.type = vlType;
exports.util = vlUtil;
exports.validate = vlValidate;
exports.version = '0.9.0';
},{"./bin":10,"./channel":11,"./compiler/compiler":14,"./data":23,"./encoding":24,"./fielddef":25,"./schema/schema":36,"./shorthand":39,"./spec":40,"./timeunit":41,"./type":42,"./util":43,"./validate":44}]},{},[45])(45)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvbm9kZV9tb2R1bGVzL2QzLXRpbWUvYnVpbGQvZDMtdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9iaW5zL2JpbnMuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvZ2VuZXJhdGUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L3R5cGUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvc3RhdHMuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy91dGlsLmpzIiwic3JjL2FnZ3JlZ2F0ZS50cyIsInNyYy9iaW4udHMiLCJzcmMvY2hhbm5lbC50cyIsInNyYy9jb21waWxlci9Nb2RlbC50cyIsInNyYy9jb21waWxlci9heGlzLnRzIiwic3JjL2NvbXBpbGVyL2NvbXBpbGVyLnRzIiwic3JjL2NvbXBpbGVyL2RhdGEudHMiLCJzcmMvY29tcGlsZXIvZmFjZXQudHMiLCJzcmMvY29tcGlsZXIvbGF5b3V0LnRzIiwic3JjL2NvbXBpbGVyL2xlZ2VuZC50cyIsInNyYy9jb21waWxlci9tYXJrcy50cyIsInNyYy9jb21waWxlci9zY2FsZS50cyIsInNyYy9jb21waWxlci9zdGFjay50cyIsInNyYy9jb21waWxlci90aW1lLnRzIiwic3JjL2RhdGEudHMiLCJzcmMvZW5jb2RpbmcudHMiLCJzcmMvZmllbGRkZWYudHMiLCJzcmMvbWFya3R5cGUudHMiLCJzcmMvc2NoZW1hL2F4aXMuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9iaW4uc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9kYXRhLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2xlZ2VuZC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL21hcmt0eXBlLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvc2NhbGUuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwudHMiLCJzcmMvc2NoZW1hL3NvcnQuc2NoZW1hLnRzIiwic3JjL3Nob3J0aGFuZC50cyIsInNyYy9zcGVjLnRzIiwic3JjL3RpbWV1bml0LnRzIiwic3JjL3R5cGUudHMiLCJzcmMvdXRpbC50cyIsInNyYy92YWxpZGF0ZS50cyIsInNyYy92bC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDbkIsQ0FBQztRQUdELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQ3ZCLENBQUM7UUFHRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFDLENBQUM7UUFDOUQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04s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QUFxQixDQUFDLENBQUE7QUFDbEQsSUFBWSxRQUFRLFdBQU0saUJBQWlCLENBQUMsQ0FBQTtBQUM1QyxJQUFZLFdBQVcsV0FBTSxhQUFhLENBQUMsQ0FBQTtBQUMzQyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNqQyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNqQyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUl0QixXQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixnQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUN0QixlQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUM3QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsY0FBTSxHQUFHLFFBQVEsQ0FBQztBQUNsQixpQkFBUyxHQUFHLFdBQVcsQ0FBQztBQUN4QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxnQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUVwQixlQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ2QzLXRpbWUnLCBbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuZDNfdGltZSA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcbiAgdmFyIHQxID0gbmV3IERhdGU7XG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQpIHtcblxuICAgIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSksIGRhdGU7XG4gICAgfVxuXG4gICAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICAgIGludGVydmFsLnJvdW5kID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgdmFyIGQwID0gbmV3IERhdGUoK2RhdGUpLFxuICAgICAgICAgIGQxID0gbmV3IERhdGUoZGF0ZSAtIDEpO1xuICAgICAgZmxvb3JpKGQwKSwgZmxvb3JpKGQxKSwgb2Zmc2V0aShkMSwgMSk7XG4gICAgICByZXR1cm4gZGF0ZSAtIGQwIDwgZDEgLSBkYXRlID8gZDAgOiBkMTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuY2VpbCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIHJldHVybiBvZmZzZXRpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSksIHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgICAgdmFyIHJhbmdlID0gW107XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0IC0gMSk7XG4gICAgICBzdG9wID0gbmV3IERhdGUoK3N0b3ApO1xuICAgICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgICAgaWYgKCEoc3RhcnQgPCBzdG9wKSB8fCAhKHN0ZXAgPiAwKSkgcmV0dXJuIHJhbmdlOyAvLyBhbHNvIGhhbmRsZXMgSW52YWxpZCBEYXRlXG4gICAgICBvZmZzZXRpKHN0YXJ0LCAxKSwgZmxvb3JpKHN0YXJ0KTtcbiAgICAgIGlmIChzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICB3aGlsZSAob2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCksIHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgd2hpbGUgKGZsb29yaShkYXRlKSwgIXRlc3QoZGF0ZSkpIGRhdGUuc2V0VGltZShkYXRlIC0gMSk7XG4gICAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICAgIHdoaWxlICgtLXN0ZXAgPj0gMCkgd2hpbGUgKG9mZnNldGkoZGF0ZSwgMSksICF0ZXN0KGRhdGUpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoY291bnQpIGludGVydmFsLmNvdW50ID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKGNvdW50KHQwLCB0MSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW50ZXJ2YWw7XG4gIH07XG5cbiAgdmFyIG1pbGxpc2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgLy8gbm9vcFxuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kIC0gc3RhcnQ7XG4gIH0pO1xuXG4gIHZhciBzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9KTtcblxuICB2YXIgbWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0U2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0pO1xuXG4gIHZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSk7XG5cbiAgdmFyIGRheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gKGRhdGUuZ2V0RGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzdW5kYXkgPSB3ZWVrZGF5KDApO1xuICB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcbiAgdmFyIHR1ZXNkYXkgPSB3ZWVrZGF5KDIpO1xuICB2YXIgd2VkbmVzZGF5ID0gd2Vla2RheSgzKTtcbiAgdmFyIHRodXJzZGF5ID0gd2Vla2RheSg0KTtcbiAgdmFyIGZyaWRheSA9IHdlZWtkYXkoNSk7XG4gIHZhciBzYXR1cmRheSA9IHdlZWtkYXkoNik7XG5cbiAgdmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICB9KTtcblxuICB2YXIgeWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgdmFyIHV0Y1NlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ01pbGxpc2Vjb25kcygwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAxZTM7XG4gIH0pO1xuXG4gIHZhciB1dGNNaW51dGUgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDZlNCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDZlNDtcbiAgfSk7XG5cbiAgdmFyIHV0Y0hvdXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaW51dGVzKDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDM2ZTUpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAzNmU1O1xuICB9KTtcblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcbiAgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG4gIHZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbiAgdmFyIHV0Y1dlZG5lc2RheSA9IHV0Y1dlZWtkYXkoMyk7XG4gIHZhciB1dGNUaHVyc2RheSA9IHV0Y1dlZWtkYXkoNCk7XG4gIHZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuICB2YXIgdXRjU2F0dXJkYXkgPSB1dGNXZWVrZGF5KDYpO1xuXG4gIHZhciB1dGNNb250aCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDTW9udGgoZGF0ZS5nZXRVVENNb250aCgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ01vbnRoKCkgLSBzdGFydC5nZXRVVENNb250aCgpICsgKGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKSkgKiAxMjtcbiAgfSk7XG5cbiAgdmFyIHV0Y1llYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ01vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciBtaWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZC5yYW5nZTtcbiAgdmFyIHNlY29uZHMgPSBzZWNvbmQucmFuZ2U7XG4gIHZhciBtaW51dGVzID0gbWludXRlLnJhbmdlO1xuICB2YXIgaG91cnMgPSBob3VyLnJhbmdlO1xuICB2YXIgZGF5cyA9IGRheS5yYW5nZTtcbiAgdmFyIHN1bmRheXMgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb25kYXlzID0gbW9uZGF5LnJhbmdlO1xuICB2YXIgdHVlc2RheXMgPSB0dWVzZGF5LnJhbmdlO1xuICB2YXIgd2VkbmVzZGF5cyA9IHdlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHRodXJzZGF5cyA9IHRodXJzZGF5LnJhbmdlO1xuICB2YXIgZnJpZGF5cyA9IGZyaWRheS5yYW5nZTtcbiAgdmFyIHNhdHVyZGF5cyA9IHNhdHVyZGF5LnJhbmdlO1xuICB2YXIgd2Vla3MgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb250aHMgPSBtb250aC5yYW5nZTtcbiAgdmFyIHllYXJzID0geWVhci5yYW5nZTtcblxuICB2YXIgdXRjTWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgdmFyIHV0Y01pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgdmFyIHV0Y1NlY29uZHMgPSB1dGNTZWNvbmQucmFuZ2U7XG4gIHZhciB1dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuICB2YXIgdXRjSG91cnMgPSB1dGNIb3VyLnJhbmdlO1xuICB2YXIgdXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcbiAgdmFyIHV0Y1N1bmRheXMgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb25kYXlzID0gdXRjTW9uZGF5LnJhbmdlO1xuICB2YXIgdXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5LnJhbmdlO1xuICB2YXIgdXRjV2VkbmVzZGF5cyA9IHV0Y1dlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5LnJhbmdlO1xuICB2YXIgdXRjRnJpZGF5cyA9IHV0Y0ZyaWRheS5yYW5nZTtcbiAgdmFyIHV0Y1NhdHVyZGF5cyA9IHV0Y1NhdHVyZGF5LnJhbmdlO1xuICB2YXIgdXRjV2Vla3MgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb250aHMgPSB1dGNNb250aC5yYW5nZTtcbiAgdmFyIHV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuICB2YXIgdmVyc2lvbiA9IFwiMC4wLjdcIjtcblxuICBleHBvcnRzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICBleHBvcnRzLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgZXhwb3J0cy5zZWNvbmRzID0gc2Vjb25kcztcbiAgZXhwb3J0cy5taW51dGVzID0gbWludXRlcztcbiAgZXhwb3J0cy5ob3VycyA9IGhvdXJzO1xuICBleHBvcnRzLmRheXMgPSBkYXlzO1xuICBleHBvcnRzLnN1bmRheXMgPSBzdW5kYXlzO1xuICBleHBvcnRzLm1vbmRheXMgPSBtb25kYXlzO1xuICBleHBvcnRzLnR1ZXNkYXlzID0gdHVlc2RheXM7XG4gIGV4cG9ydHMud2VkbmVzZGF5cyA9IHdlZG5lc2RheXM7XG4gIGV4cG9ydHMudGh1cnNkYXlzID0gdGh1cnNkYXlzO1xuICBleHBvcnRzLmZyaWRheXMgPSBmcmlkYXlzO1xuICBleHBvcnRzLnNhdHVyZGF5cyA9IHNhdHVyZGF5cztcbiAgZXhwb3J0cy53ZWVrcyA9IHdlZWtzO1xuICBleHBvcnRzLm1vbnRocyA9IG1vbnRocztcbiAgZXhwb3J0cy55ZWFycyA9IHllYXJzO1xuICBleHBvcnRzLnV0Y01pbGxpc2Vjb25kID0gdXRjTWlsbGlzZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWlsbGlzZWNvbmRzID0gdXRjTWlsbGlzZWNvbmRzO1xuICBleHBvcnRzLnV0Y1NlY29uZHMgPSB1dGNTZWNvbmRzO1xuICBleHBvcnRzLnV0Y01pbnV0ZXMgPSB1dGNNaW51dGVzO1xuICBleHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91cnM7XG4gIGV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheXM7XG4gIGV4cG9ydHMudXRjU3VuZGF5cyA9IHV0Y1N1bmRheXM7XG4gIGV4cG9ydHMudXRjTW9uZGF5cyA9IHV0Y01vbmRheXM7XG4gIGV4cG9ydHMudXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5cztcbiAgZXhwb3J0cy51dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5cztcbiAgZXhwb3J0cy51dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheXM7XG4gIGV4cG9ydHMudXRjRnJpZGF5cyA9IHV0Y0ZyaWRheXM7XG4gIGV4cG9ydHMudXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXlzO1xuICBleHBvcnRzLnV0Y1dlZWtzID0gdXRjV2Vla3M7XG4gIGV4cG9ydHMudXRjTW9udGhzID0gdXRjTW9udGhzO1xuICBleHBvcnRzLnV0Y1llYXJzID0gdXRjWWVhcnM7XG4gIGV4cG9ydHMubWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgZXhwb3J0cy5zZWNvbmQgPSBzZWNvbmQ7XG4gIGV4cG9ydHMubWludXRlID0gbWludXRlO1xuICBleHBvcnRzLmhvdXIgPSBob3VyO1xuICBleHBvcnRzLmRheSA9IGRheTtcbiAgZXhwb3J0cy5zdW5kYXkgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9uZGF5ID0gbW9uZGF5O1xuICBleHBvcnRzLnR1ZXNkYXkgPSB0dWVzZGF5O1xuICBleHBvcnRzLndlZG5lc2RheSA9IHdlZG5lc2RheTtcbiAgZXhwb3J0cy50aHVyc2RheSA9IHRodXJzZGF5O1xuICBleHBvcnRzLmZyaWRheSA9IGZyaWRheTtcbiAgZXhwb3J0cy5zYXR1cmRheSA9IHNhdHVyZGF5O1xuICBleHBvcnRzLndlZWsgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9udGggPSBtb250aDtcbiAgZXhwb3J0cy55ZWFyID0geWVhcjtcbiAgZXhwb3J0cy51dGNTZWNvbmQgPSB1dGNTZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuICBleHBvcnRzLnV0Y0hvdXIgPSB1dGNIb3VyO1xuICBleHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbiAgZXhwb3J0cy51dGNTdW5kYXkgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9uZGF5ID0gdXRjTW9uZGF5O1xuICBleHBvcnRzLnV0Y1R1ZXNkYXkgPSB1dGNUdWVzZGF5O1xuICBleHBvcnRzLnV0Y1dlZG5lc2RheSA9IHV0Y1dlZG5lc2RheTtcbiAgZXhwb3J0cy51dGNUaHVyc2RheSA9IHV0Y1RodXJzZGF5O1xuICBleHBvcnRzLnV0Y0ZyaWRheSA9IHV0Y0ZyaWRheTtcbiAgZXhwb3J0cy51dGNTYXR1cmRheSA9IHV0Y1NhdHVyZGF5O1xuICBleHBvcnRzLnV0Y1dlZWsgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9udGggPSB1dGNNb250aDtcbiAgZXhwb3J0cy51dGNZZWFyID0gdXRjWWVhcjtcbiAgZXhwb3J0cy5pbnRlcnZhbCA9IG5ld0ludGVydmFsO1xuXG59KSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4uL3RpbWUnKSxcbiAgICBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbnMob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSxcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXApIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcblxuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgZG8geyBzdGVwICo9IGJhc2U7IH0gd2hpbGUgKE1hdGguY2VpbChzcGFuL3N0ZXApID4gbWF4Yik7XG5cbiAgICAvLyBkZWNyZWFzZSBzdGVwIHNpemUgaWYgYWxsb3dlZFxuICAgIGZvciAoaT0wOyBpPGRpdi5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHN0ZXAgLyBkaXZbaV07XG4gICAgICBpZiAodiA+PSBtaW5zdGVwICYmIHNwYW4gLyB2IDw9IG1heGIpIHN0ZXAgPSB2O1xuICAgIH1cbiAgfVxuXG4gIC8vIHVwZGF0ZSBwcmVjaXNpb24sIG1pbiBhbmQgbWF4XG4gIHYgPSBNYXRoLmxvZyhzdGVwKTtcbiAgcHJlY2lzaW9uID0gdiA+PSAwID8gMCA6IH5+KC12IC8gbG9nYikgKyAxO1xuICBlcHMgPSBNYXRoLnBvdyhiYXNlLCAtcHJlY2lzaW9uIC0gMSk7XG4gIG1pbiA9IE1hdGgubWluKG1pbiwgTWF0aC5mbG9vcihtaW4gLyBzdGVwICsgZXBzKSAqIHN0ZXApO1xuICBtYXggPSBNYXRoLmNlaWwobWF4IC8gc3RlcCkgKiBzdGVwO1xuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IG1pbixcbiAgICBzdG9wOiAgbWF4LFxuICAgIHN0ZXA6ICBzdGVwLFxuICAgIHVuaXQ6ICB7cHJlY2lzaW9uOiBwcmVjaXNpb259LFxuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBpbmRleDogaW5kZXhcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmlzZWN0KGEsIHgsIGxvLCBoaSkge1xuICB3aGlsZSAobG8gPCBoaSkge1xuICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgIGlmICh1dGlsLmNtcChhW21pZF0sIHgpIDwgMCkgeyBsbyA9IG1pZCArIDE7IH1cbiAgICBlbHNlIHsgaGkgPSBtaWQ7IH1cbiAgfVxuICByZXR1cm4gbG87XG59XG5cbmZ1bmN0aW9uIHZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMuc3RlcCAqIE1hdGguZmxvb3IodiAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBpbmRleCh2KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKCh2IC0gdGhpcy5zdGFydCkgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV92YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnVuaXQuZGF0ZSh2YWx1ZS5jYWxsKHRoaXMsIHYpKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV9pbmRleCh2KSB7XG4gIHJldHVybiBpbmRleC5jYWxsKHRoaXMsIHRoaXMudW5pdC51bml0KHYpKTtcbn1cblxuYmlucy5kYXRlID0gZnVuY3Rpb24ob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBkYXRlIGJpbm5pbmcgb3B0aW9ucy5cIik7IH1cblxuICAvLyBmaW5kIHRpbWUgc3RlcCwgdGhlbiBiaW5cbiAgdmFyIHVuaXRzID0gb3B0LnV0YyA/IHRpbWUudXRjIDogdGltZSxcbiAgICAgIGRtaW4gPSBvcHQubWluLFxuICAgICAgZG1heCA9IG9wdC5tYXgsXG4gICAgICBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMjAsXG4gICAgICBtaW5iID0gb3B0Lm1pbmJpbnMgfHwgNCxcbiAgICAgIHNwYW4gPSAoK2RtYXgpIC0gKCtkbWluKSxcbiAgICAgIHVuaXQgPSBvcHQudW5pdCA/IHVuaXRzW29wdC51bml0XSA6IHVuaXRzLmZpbmQoc3BhbiwgbWluYiwgbWF4YiksXG4gICAgICBzcGVjID0gYmlucyh7XG4gICAgICAgIG1pbjogICAgIHVuaXQubWluICE9IG51bGwgPyB1bml0Lm1pbiA6IHVuaXQudW5pdChkbWluKSxcbiAgICAgICAgbWF4OiAgICAgdW5pdC5tYXggIT0gbnVsbCA/IHVuaXQubWF4IDogdW5pdC51bml0KGRtYXgpLFxuICAgICAgICBtYXhiaW5zOiBtYXhiLFxuICAgICAgICBtaW5zdGVwOiB1bml0Lm1pbnN0ZXAsXG4gICAgICAgIHN0ZXBzOiAgIHVuaXQuc3RlcFxuICAgICAgfSk7XG5cbiAgc3BlYy51bml0ID0gdW5pdDtcbiAgc3BlYy5pbmRleCA9IGRhdGVfaW5kZXg7XG4gIGlmICghb3B0LnJhdykgc3BlYy52YWx1ZSA9IGRhdGVfdmFsdWU7XG4gIHJldHVybiBzcGVjO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5zO1xuIiwidmFyIGdlbiA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmdlbi5yZXBlYXQgPSBmdW5jdGlvbih2YWwsIG4pIHtcbiAgdmFyIGEgPSBBcnJheShuKSwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBhW2ldID0gdmFsO1xuICByZXR1cm4gYTtcbn07XG5cbmdlbi56ZXJvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuIGdlbi5yZXBlYXQoMCwgbik7XG59O1xuXG5nZW4ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PSBJbmZpbml0eSkgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSByYW5nZScpO1xuICB2YXIgcmFuZ2UgPSBbXSwgaSA9IC0xLCBqO1xuICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGopO1xuICBlbHNlIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPCBzdG9wKSByYW5nZS5wdXNoKGopO1xuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5nZW4ucmFuZG9tID0ge307XG5cbmdlbi5yYW5kb20udW5pZm9ybSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgIG1heCA9IG1pbiA9PT0gdW5kZWZpbmVkID8gMSA6IG1pbjtcbiAgICBtaW4gPSAwO1xuICB9XG4gIHZhciBkID0gbWF4IC0gbWluO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtaW4gKyBkICogTWF0aC5yYW5kb20oKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLmludGVnZXIgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICBiID0gYTtcbiAgICBhID0gMDtcbiAgfVxuICB2YXIgZCA9IGIgLSBhO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhICsgTWF0aC5mbG9vcihkICogTWF0aC5yYW5kb20oKSk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5ub3JtYWwgPSBmdW5jdGlvbihtZWFuLCBzdGRldikge1xuICBtZWFuID0gbWVhbiB8fCAwO1xuICBzdGRldiA9IHN0ZGV2IHx8IDE7XG4gIHZhciBuZXh0O1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gMCwgeSA9IDAsIHJkcywgYztcbiAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB4ID0gbmV4dDtcbiAgICAgIG5leHQgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgeCA9IE1hdGgucmFuZG9tKCkqMi0xO1xuICAgICAgeSA9IE1hdGgucmFuZG9tKCkqMi0xO1xuICAgICAgcmRzID0geCp4ICsgeSp5O1xuICAgIH0gd2hpbGUgKHJkcyA9PT0gMCB8fCByZHMgPiAxKTtcbiAgICBjID0gTWF0aC5zcXJ0KC0yKk1hdGgubG9nKHJkcykvcmRzKTsgLy8gQm94LU11bGxlciB0cmFuc2Zvcm1cbiAgICBuZXh0ID0gbWVhbiArIHkqYypzdGRldjtcbiAgICByZXR1cm4gbWVhbiArIHgqYypzdGRldjtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcbiAgcmV0dXJuIGY7XG59O1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBUWVBFUyA9ICdfX3R5cGVzX18nO1xuXG52YXIgUEFSU0VSUyA9IHtcbiAgYm9vbGVhbjogdXRpbC5ib29sZWFuLFxuICBpbnRlZ2VyOiB1dGlsLm51bWJlcixcbiAgbnVtYmVyOiAgdXRpbC5udW1iZXIsXG4gIGRhdGU6ICAgIHV0aWwuZGF0ZSxcbiAgc3RyaW5nOiAgZnVuY3Rpb24oeCkgeyByZXR1cm4geD09PScnID8gbnVsbCA6IHg7IH1cbn07XG5cbnZhciBURVNUUyA9IHtcbiAgYm9vbGVhbjogZnVuY3Rpb24oeCkgeyByZXR1cm4geD09PSd0cnVlJyB8fCB4PT09J2ZhbHNlJyB8fCB1dGlsLmlzQm9vbGVhbih4KTsgfSxcbiAgaW50ZWdlcjogZnVuY3Rpb24oeCkgeyByZXR1cm4gVEVTVFMubnVtYmVyKHgpICYmICh4PSt4KSA9PT0gfn54OyB9LFxuICBudW1iZXI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICFpc05hTigreCkgJiYgIXV0aWwuaXNEYXRlKHgpOyB9LFxuICBkYXRlOiBmdW5jdGlvbih4KSB7IHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZSh4KSk7IH1cbn07XG5cbmZ1bmN0aW9uIGFubm90YXRpb24oZGF0YSwgdHlwZXMpIHtcbiAgaWYgKCF0eXBlcykgcmV0dXJuIGRhdGEgJiYgZGF0YVtUWVBFU10gfHwgbnVsbDtcbiAgZGF0YVtUWVBFU10gPSB0eXBlcztcbn1cblxuZnVuY3Rpb24gdHlwZSh2YWx1ZXMsIGYpIHtcbiAgdmFsdWVzID0gdXRpbC5hcnJheSh2YWx1ZXMpO1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbjtcblxuICAvLyBpZiBkYXRhIGFycmF5IGhhcyB0eXBlIGFubm90YXRpb25zLCB1c2UgdGhlbVxuICBpZiAodmFsdWVzW1RZUEVTXSkge1xuICAgIHYgPSBmKHZhbHVlc1tUWVBFU10pO1xuICAgIGlmICh1dGlsLmlzU3RyaW5nKHYpKSByZXR1cm4gdjtcbiAgfVxuXG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7ICF1dGlsLmlzVmFsaWQodikgJiYgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgfVxuXG4gIHJldHVybiB1dGlsLmlzRGF0ZSh2KSA/ICdkYXRlJyA6XG4gICAgdXRpbC5pc051bWJlcih2KSAgICA/ICdudW1iZXInIDpcbiAgICB1dGlsLmlzQm9vbGVhbih2KSAgID8gJ2Jvb2xlYW4nIDpcbiAgICB1dGlsLmlzU3RyaW5nKHYpICAgID8gJ3N0cmluZycgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0eXBlQWxsKGRhdGEsIGZpZWxkcykge1xuICBpZiAoIWRhdGEubGVuZ3RoKSByZXR1cm47XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKGZ1bmN0aW9uKHR5cGVzLCBmKSB7XG4gICAgcmV0dXJuICh0eXBlc1tmXSA9IHR5cGUoZGF0YSwgZiksIHR5cGVzKTtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBpbmZlcih2YWx1ZXMsIGYpIHtcbiAgdmFsdWVzID0gdXRpbC5hcnJheSh2YWx1ZXMpO1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgaSwgaiwgdjtcblxuICAvLyB0eXBlcyB0byB0ZXN0IGZvciwgaW4gcHJlY2VkZW5jZSBvcmRlclxuICB2YXIgdHlwZXMgPSBbJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInLCAnZGF0ZSddO1xuXG4gIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIC8vIGdldCBuZXh0IHZhbHVlIHRvIHRlc3RcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICAvLyB0ZXN0IHZhbHVlIGFnYWluc3QgcmVtYWluaW5nIHR5cGVzXG4gICAgZm9yIChqPTA7IGo8dHlwZXMubGVuZ3RoOyArK2opIHtcbiAgICAgIGlmICh1dGlsLmlzVmFsaWQodikgJiYgIVRFU1RTW3R5cGVzW2pdXSh2KSkge1xuICAgICAgICB0eXBlcy5zcGxpY2UoaiwgMSk7XG4gICAgICAgIGogLT0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgbm8gdHlwZXMgbGVmdCwgcmV0dXJuICdzdHJpbmcnXG4gICAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdzdHJpbmcnO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVzWzBdO1xufVxuXG5mdW5jdGlvbiBpbmZlckFsbChkYXRhLCBmaWVsZHMpIHtcbiAgZmllbGRzID0gZmllbGRzIHx8IHV0aWwua2V5cyhkYXRhWzBdKTtcbiAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoZnVuY3Rpb24odHlwZXMsIGYpIHtcbiAgICB0eXBlc1tmXSA9IGluZmVyKGRhdGEsIGYpO1xuICAgIHJldHVybiB0eXBlcztcbiAgfSwge30pO1xufVxuXG50eXBlLmFubm90YXRpb24gPSBhbm5vdGF0aW9uO1xudHlwZS5hbGwgPSB0eXBlQWxsO1xudHlwZS5pbmZlciA9IGluZmVyO1xudHlwZS5pbmZlckFsbCA9IGluZmVyQWxsO1xudHlwZS5wYXJzZXJzID0gUEFSU0VSUztcbm1vZHVsZS5leHBvcnRzID0gdHlwZTtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJy4vaW1wb3J0L3R5cGUnKTtcbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG52YXIgc3RhdHMgPSB7fTtcblxuLy8gQ29sbGVjdCB1bmlxdWUgdmFsdWVzLlxuLy8gT3V0cHV0OiBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBmaXJzdC1vYnNlcnZlZCBvcmRlclxuc3RhdHMudW5pcXVlID0gZnVuY3Rpb24odmFsdWVzLCBmLCByZXN1bHRzKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuICB2YXIgdSA9IHt9LCB2LCBpLCBuO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIGNvbnRpbnVlO1xuICAgIHVbdl0gPSAxO1xuICAgIHJlc3VsdHMucHVzaCh2KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnB1dCBhcnJheS5cbnN0YXRzLmNvdW50ID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aCB8fCAwO1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBub24tbnVsbCwgbm9uLXVuZGVmaW5lZCwgbm9uLU5hTiB2YWx1ZXMuXG5zdGF0cy5jb3VudC52YWxpZCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbiwgdmFsaWQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHZhbGlkICs9IDE7XG4gIH1cbiAgcmV0dXJuIHZhbGlkO1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5taXNzaW5nID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB2LCBpLCBuLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgPT0gbnVsbCkgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIGRpc3RpbmN0IHZhbHVlcy5cbi8vIE51bGwsIHVuZGVmaW5lZCBhbmQgTmFOIGFyZSBlYWNoIGNvbnNpZGVyZWQgZGlzdGluY3QgdmFsdWVzLlxuc3RhdHMuY291bnQuZGlzdGluY3QgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHUgPSB7fSwgdiwgaSwgbiwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIGNvbnRpbnVlO1xuICAgIHVbdl0gPSAxO1xuICAgIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ29uc3RydWN0IGEgbWFwIGZyb20gZGlzdGluY3QgdmFsdWVzIHRvIG9jY3VycmVuY2UgY291bnRzLlxuc3RhdHMuY291bnQubWFwID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBtYXAgPSB7fSwgdiwgaSwgbjtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBtYXBbdl0gPSAodiBpbiBtYXApID8gbWFwW3ZdICsgMSA6IDE7XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG1lZGlhbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVkaWFuID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmIChmKSB2YWx1ZXMgPSB2YWx1ZXMubWFwKHV0aWwuJChmKSk7XG4gIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodXRpbC5pc1ZhbGlkKS5zb3J0KHV0aWwuY21wKTtcbiAgcmV0dXJuIHN0YXRzLnF1YW50aWxlKHZhbHVlcywgMC41KTtcbn07XG5cbi8vIENvbXB1dGVzIHRoZSBxdWFydGlsZSBib3VuZGFyaWVzIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5xdWFydGlsZSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoZikgdmFsdWVzID0gdmFsdWVzLm1hcCh1dGlsLiQoZikpO1xuICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHV0aWwuaXNWYWxpZCkuc29ydCh1dGlsLmNtcCk7XG4gIHZhciBxID0gc3RhdHMucXVhbnRpbGU7XG4gIHJldHVybiBbcSh2YWx1ZXMsIDAuMjUpLCBxKHZhbHVlcywgMC41MCksIHEodmFsdWVzLCAwLjc1KV07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBxdWFudGlsZSBvZiBhIHNvcnRlZCBhcnJheSBvZiBudW1iZXJzLlxuLy8gQWRhcHRlZCBmcm9tIHRoZSBEMy5qcyBpbXBsZW1lbnRhdGlvbi5cbnN0YXRzLnF1YW50aWxlID0gZnVuY3Rpb24odmFsdWVzLCBmLCBwKSB7XG4gIGlmIChwID09PSB1bmRlZmluZWQpIHsgcCA9IGY7IGYgPSB1dGlsLmlkZW50aXR5OyB9XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBIID0gKHZhbHVlcy5sZW5ndGggLSAxKSAqIHAgKyAxLFxuICAgICAgaCA9IE1hdGguZmxvb3IoSCksXG4gICAgICB2ID0gK2YodmFsdWVzW2ggLSAxXSksXG4gICAgICBlID0gSCAtIGg7XG4gIHJldHVybiBlID8gdiArIGUgKiAoZih2YWx1ZXNbaF0pIC0gdikgOiB2O1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc3VtIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5zdW0gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgZm9yICh2YXIgc3VtPTAsIGk9MCwgbj12YWx1ZXMubGVuZ3RoLCB2OyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHN1bSArPSB2O1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtZWFuIChhdmVyYWdlKSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVhbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgbWVhbiA9IDAsIGRlbHRhLCBpLCBuLCBjLCB2O1xuICBmb3IgKGk9MCwgYz0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgZGVsdGEgPSB2IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKytjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1lYW47XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgdmFyaWFuY2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnZhcmlhbmNlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aCA8IDIpIHJldHVybiAwO1xuICB2YXIgbWVhbiA9IDAsIE0yID0gMCwgZGVsdGEsIGksIGMsIHY7XG4gIGZvciAoaT0wLCBjPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgZGVsdGEgPSB2IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKytjKTtcbiAgICAgIE0yID0gTTIgKyBkZWx0YSAqICh2IC0gbWVhbik7XG4gICAgfVxuICB9XG4gIE0yID0gTTIgLyAoYyAtIDEpO1xuICByZXR1cm4gTTI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5zdGRldiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gTWF0aC5zcXJ0KHN0YXRzLnZhcmlhbmNlKHZhbHVlcywgZikpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgUGVhcnNvbiBtb2RlIHNrZXduZXNzICgobWVkaWFuLW1lYW4pL3N0ZGV2KSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubW9kZXNrZXcgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIGF2ZyA9IHN0YXRzLm1lYW4odmFsdWVzLCBmKSxcbiAgICAgIG1lZCA9IHN0YXRzLm1lZGlhbih2YWx1ZXMsIGYpLFxuICAgICAgc3RkID0gc3RhdHMuc3RkZXYodmFsdWVzLCBmKTtcbiAgcmV0dXJuIHN0ZCA9PT0gMCA/IDAgOiAoYXZnIC0gbWVkKSAvIHN0ZDtcbn07XG5cbi8vIEZpbmQgdGhlIG1pbmltdW0gdmFsdWUgaW4gYW4gYXJyYXkuXG5zdGF0cy5taW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgcmV0dXJuIHN0YXRzLmV4dGVudCh2YWx1ZXMsIGYpWzBdO1xufTtcblxuLy8gRmluZCB0aGUgbWF4aW11bSB2YWx1ZSBpbiBhbiBhcnJheS5cbnN0YXRzLm1heCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gc3RhdHMuZXh0ZW50KHZhbHVlcywgZilbMV07XG59O1xuXG4vLyBGaW5kIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIG9mIGFuIGFycmF5IG9mIHZhbHVlcy5cbnN0YXRzLmV4dGVudCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgYSwgYiwgdiwgaSwgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHsgYSA9IGIgPSB2OyBicmVhazsgfVxuICB9XG4gIGZvciAoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGlmICh2IDwgYSkgYSA9IHY7XG4gICAgICBpZiAodiA+IGIpIGIgPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gW2EsIGJdO1xufTtcblxuLy8gRmluZCB0aGUgaW50ZWdlciBpbmRpY2VzIG9mIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy5cbnN0YXRzLmV4dGVudC5pbmRleCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgeCA9IC0xLCB5ID0gLTEsIGEsIGIsIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7IGEgPSBiID0gdjsgeCA9IHkgPSBpOyBicmVhazsgfVxuICB9XG4gIGZvciAoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGlmICh2IDwgYSkgeyBhID0gdjsgeCA9IGk7IH1cbiAgICAgIGlmICh2ID4gYikgeyBiID0gdjsgeSA9IGk7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFt4LCB5XTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbnN0YXRzLmRvdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgc3VtID0gMCwgaSwgdjtcbiAgaWYgKCFiKSB7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggIT09IGEubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXJyYXkgbGVuZ3RocyBtdXN0IG1hdGNoLicpO1xuICAgIH1cbiAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSB2YWx1ZXNbaV0gKiBhW2ldO1xuICAgICAgaWYgKHYgPT09IHYpIHN1bSArPSB2O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhID0gdXRpbC4kKGEpO1xuICAgIGIgPSB1dGlsLiQoYik7XG4gICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gYSh2YWx1ZXNbaV0pICogYih2YWx1ZXNbaV0pO1xuICAgICAgaWYgKHYgPT09IHYpIHN1bSArPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuLy8gQ29tcHV0ZSBhc2NlbmRpbmcgcmFuayBzY29yZXMgZm9yIGFuIGFycmF5IG9mIHZhbHVlcy5cbi8vIFRpZXMgYXJlIGFzc2lnbmVkIHRoZWlyIGNvbGxlY3RpdmUgbWVhbiByYW5rLlxuc3RhdHMucmFuayA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpIHx8IHV0aWwuaWRlbnRpdHk7XG4gIHZhciBhID0gdmFsdWVzLm1hcChmdW5jdGlvbih2LCBpKSB7XG4gICAgICByZXR1cm4ge2lkeDogaSwgdmFsOiBmKHYpfTtcbiAgICB9KVxuICAgIC5zb3J0KHV0aWwuY29tcGFyYXRvcigndmFsJykpO1xuXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHIgPSBBcnJheShuKSxcbiAgICAgIHRpZSA9IC0xLCBwID0ge30sIGksIHYsIG11O1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBhW2ldLnZhbDtcbiAgICBpZiAodGllIDwgMCAmJiBwID09PSB2KSB7XG4gICAgICB0aWUgPSBpIC0gMTtcbiAgICB9IGVsc2UgaWYgKHRpZSA+IC0xICYmIHAgIT09IHYpIHtcbiAgICAgIG11ID0gMSArIChpLTEgKyB0aWUpIC8gMjtcbiAgICAgIGZvciAoOyB0aWU8aTsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgICAgIHRpZSA9IC0xO1xuICAgIH1cbiAgICByW2FbaV0uaWR4XSA9IGkgKyAxO1xuICAgIHAgPSB2O1xuICB9XG5cbiAgaWYgKHRpZSA+IC0xKSB7XG4gICAgbXUgPSAxICsgKG4tMSArIHRpZSkgLyAyO1xuICAgIGZvciAoOyB0aWU8bjsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIFBlYXJzb24gcHJvZHVjdC1tb21lbnQgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuY29yID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBmbiA9IGI7XG4gIGIgPSBmbiA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGE7XG4gIGEgPSBmbiA/IHZhbHVlcy5tYXAodXRpbC4kKGEpKSA6IHZhbHVlcztcblxuICB2YXIgZG90ID0gc3RhdHMuZG90KGEsIGIpLFxuICAgICAgbXVhID0gc3RhdHMubWVhbihhKSxcbiAgICAgIG11YiA9IHN0YXRzLm1lYW4oYiksXG4gICAgICBzZGEgPSBzdGF0cy5zdGRldihhKSxcbiAgICAgIHNkYiA9IHN0YXRzLnN0ZGV2KGIpLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgcmV0dXJuIChkb3QgLSBuKm11YSptdWIpIC8gKChuLTEpICogc2RhICogc2RiKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFNwZWFybWFuIHJhbmsgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiB2YWx1ZXMuXG5zdGF0cy5jb3IucmFuayA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgcmEgPSBiID8gc3RhdHMucmFuayh2YWx1ZXMsIHV0aWwuJChhKSkgOiBzdGF0cy5yYW5rKHZhbHVlcyksXG4gICAgICByYiA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgdXRpbC4kKGIpKSA6IHN0YXRzLnJhbmsoYSksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgaSwgcywgZDtcblxuICBmb3IgKGk9MCwgcz0wOyBpPG47ICsraSkge1xuICAgIGQgPSByYVtpXSAtIHJiW2ldO1xuICAgIHMgKz0gZCAqIGQ7XG4gIH1cblxuICByZXR1cm4gMSAtIDYqcyAvIChuICogKG4qbi0xKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBkaXN0YW5jZSBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Rpc3RhbmNlX2NvcnJlbGF0aW9uXG5zdGF0cy5jb3IuZGlzdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgWCA9IGIgPyB2YWx1ZXMubWFwKHV0aWwuJChhKSkgOiB2YWx1ZXMsXG4gICAgICBZID0gYiA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGE7XG5cbiAgdmFyIEEgPSBzdGF0cy5kaXN0Lm1hdChYKSxcbiAgICAgIEIgPSBzdGF0cy5kaXN0Lm1hdChZKSxcbiAgICAgIG4gPSBBLmxlbmd0aCxcbiAgICAgIGksIGFhLCBiYiwgYWI7XG5cbiAgZm9yIChpPTAsIGFhPTAsIGJiPTAsIGFiPTA7IGk8bjsgKytpKSB7XG4gICAgYWEgKz0gQVtpXSpBW2ldO1xuICAgIGJiICs9IEJbaV0qQltpXTtcbiAgICBhYiArPSBBW2ldKkJbaV07XG4gIH1cblxuICByZXR1cm4gTWF0aC5zcXJ0KGFiIC8gTWF0aC5zcXJ0KGFhKmJiKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSB2ZWN0b3IgZGlzdGFuY2UgYmV0d2VlbiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBEZWZhdWx0IGlzIEV1Y2xpZGVhbiAoZXhwPTIpIGRpc3RhbmNlLCBjb25maWd1cmFibGUgdmlhIGV4cCBhcmd1bWVudC5cbnN0YXRzLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGV4cCkge1xuICB2YXIgZiA9IHV0aWwuaXNGdW5jdGlvbihiKSB8fCB1dGlsLmlzU3RyaW5nKGIpLFxuICAgICAgWCA9IHZhbHVlcyxcbiAgICAgIFkgPSBmID8gdmFsdWVzIDogYSxcbiAgICAgIGUgPSBmID8gZXhwIDogYixcbiAgICAgIEwyID0gZSA9PT0gMiB8fCBlID09IG51bGwsXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgcyA9IDAsIGQsIGk7XG4gIGlmIChmKSB7XG4gICAgYSA9IHV0aWwuJChhKTtcbiAgICBiID0gdXRpbC4kKGIpO1xuICB9XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIGQgPSBmID8gKGEoWFtpXSktYihZW2ldKSkgOiAoWFtpXS1ZW2ldKTtcbiAgICBzICs9IEwyID8gZCpkIDogTWF0aC5wb3coTWF0aC5hYnMoZCksIGUpO1xuICB9XG4gIHJldHVybiBMMiA/IE1hdGguc3FydChzKSA6IE1hdGgucG93KHMsIDEvZSk7XG59O1xuXG4vLyBDb25zdHJ1Y3QgYSBtZWFuLWNlbnRlcmVkIGRpc3RhbmNlIG1hdHJpeCBmb3IgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLmRpc3QubWF0ID0gZnVuY3Rpb24oWCkge1xuICB2YXIgbiA9IFgubGVuZ3RoLFxuICAgICAgbSA9IG4qbixcbiAgICAgIEEgPSBBcnJheShtKSxcbiAgICAgIFIgPSBnZW4uemVyb3MobiksXG4gICAgICBNID0gMCwgdiwgaSwgajtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBBW2kqbitpXSA9IDA7XG4gICAgZm9yIChqPWkrMTsgajxuOyArK2opIHtcbiAgICAgIEFbaSpuK2pdID0gKHYgPSBNYXRoLmFicyhYW2ldIC0gWFtqXSkpO1xuICAgICAgQVtqKm4raV0gPSB2O1xuICAgICAgUltpXSArPSB2O1xuICAgICAgUltqXSArPSB2O1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIE0gKz0gUltpXTtcbiAgICBSW2ldIC89IG47XG4gIH1cbiAgTSAvPSBtO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIGZvciAoaj1pOyBqPG47ICsraikge1xuICAgICAgQVtpKm4ral0gKz0gTSAtIFJbaV0gLSBSW2pdO1xuICAgICAgQVtqKm4raV0gPSBBW2kqbitqXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFNoYW5ub24gZW50cm9weSAobG9nIGJhc2UgMikgb2YgYW4gYXJyYXkgb2YgY291bnRzLlxuc3RhdHMuZW50cm9weSA9IGZ1bmN0aW9uKGNvdW50cywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgaSwgcCwgcyA9IDAsIEggPSAwLCBuID0gY291bnRzLmxlbmd0aDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcyArPSAoZiA/IGYoY291bnRzW2ldKSA6IGNvdW50c1tpXSk7XG4gIH1cbiAgaWYgKHMgPT09IDApIHJldHVybiAwO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBwID0gKGYgPyBmKGNvdW50c1tpXSkgOiBjb3VudHNbaV0pIC8gcztcbiAgICBpZiAocCkgSCArPSBwICogTWF0aC5sb2cocCk7XG4gIH1cbiAgcmV0dXJuIC1IIC8gTWF0aC5MTjI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtdXR1YWwgaW5mb3JtYXRpb24gYmV0d2VlbiB0d28gZGlzY3JldGUgdmFyaWFibGVzLlxuLy8gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgZm9ybSBbTUksIE1JX2Rpc3RhbmNlXVxuLy8gTUlfZGlzdGFuY2UgaXMgZGVmaW5lZCBhcyAxIC0gSShhLGIpIC8gSChhLGIpLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NdXR1YWxfaW5mb3JtYXRpb25cbnN0YXRzLm11dHVhbCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHZhciB4ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzLFxuICAgICAgeSA9IGNvdW50cyA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGEsXG4gICAgICB6ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoY291bnRzKSkgOiBiO1xuXG4gIHZhciBweCA9IHt9LFxuICAgICAgcHkgPSB7fSxcbiAgICAgIG4gPSB6Lmxlbmd0aCxcbiAgICAgIHMgPSAwLCBJID0gMCwgSCA9IDAsIHAsIHQsIGk7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcHhbeFtpXV0gPSAwO1xuICAgIHB5W3lbaV1dID0gMDtcbiAgfVxuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHB4W3hbaV1dICs9IHpbaV07XG4gICAgcHlbeVtpXV0gKz0geltpXTtcbiAgICBzICs9IHpbaV07XG4gIH1cblxuICB0ID0gMSAvIChzICogTWF0aC5MTjIpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBpZiAoeltpXSA9PT0gMCkgY29udGludWU7XG4gICAgcCA9IChzICogeltpXSkgLyAocHhbeFtpXV0gKiBweVt5W2ldXSk7XG4gICAgSSArPSB6W2ldICogdCAqIE1hdGgubG9nKHApO1xuICAgIEggKz0geltpXSAqIHQgKiBNYXRoLmxvZyh6W2ldL3MpO1xuICB9XG5cbiAgcmV0dXJuIFtJLCAxICsgSS9IXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG5zdGF0cy5tdXR1YWwuaW5mbyA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHJldHVybiBzdGF0cy5tdXR1YWwodmFsdWVzLCBhLCBiLCBjb3VudHMpWzBdO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbXV0dWFsIGluZm9ybWF0aW9uIGRpc3RhbmNlIGJldHdlZW4gdHdvIGRpc2NyZXRlIHZhcmlhYmxlcy5cbi8vIE1JX2Rpc3RhbmNlIGlzIGRlZmluZWQgYXMgMSAtIEkoYSxiKSAvIEgoYSxiKS5cbnN0YXRzLm11dHVhbC5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgcmV0dXJuIHN0YXRzLm11dHVhbCh2YWx1ZXMsIGEsIGIsIGNvdW50cylbMV07XG59O1xuXG4vLyBDb21wdXRlIGEgcHJvZmlsZSBvZiBzdW1tYXJ5IHN0YXRpc3RpY3MgZm9yIGEgdmFyaWFibGUuXG5zdGF0cy5wcm9maWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBtZWFuID0gMCxcbiAgICAgIHZhbGlkID0gMCxcbiAgICAgIG1pc3NpbmcgPSAwLFxuICAgICAgZGlzdGluY3QgPSAwLFxuICAgICAgbWluID0gbnVsbCxcbiAgICAgIG1heCA9IG51bGwsXG4gICAgICBNMiA9IDAsXG4gICAgICB2YWxzID0gW10sXG4gICAgICB1ID0ge30sIGRlbHRhLCBzZCwgaSwgdiwgeDtcblxuICAvLyBjb21wdXRlIHN1bW1hcnkgc3RhdHNcbiAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG5cbiAgICAvLyB1cGRhdGUgdW5pcXVlIHZhbHVlc1xuICAgIHVbdl0gPSAodiBpbiB1KSA/IHVbdl0gKyAxIDogKGRpc3RpbmN0ICs9IDEsIDEpO1xuXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgKyttaXNzaW5nO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICAvLyB1cGRhdGUgc3RhdHNcbiAgICAgIHggPSAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/IHYubGVuZ3RoIDogdjtcbiAgICAgIGlmIChtaW49PT1udWxsIHx8IHggPCBtaW4pIG1pbiA9IHg7XG4gICAgICBpZiAobWF4PT09bnVsbCB8fCB4ID4gbWF4KSBtYXggPSB4O1xuICAgICAgZGVsdGEgPSB4IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKyt2YWxpZCk7XG4gICAgICBNMiA9IE0yICsgZGVsdGEgKiAoeCAtIG1lYW4pO1xuICAgICAgdmFscy5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICBNMiA9IE0yIC8gKHZhbGlkIC0gMSk7XG4gIHNkID0gTWF0aC5zcXJ0KE0yKTtcblxuICAvLyBzb3J0IHZhbHVlcyBmb3IgbWVkaWFuIGFuZCBpcXJcbiAgdmFscy5zb3J0KHV0aWwuY21wKTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICAgICB0eXBlKHZhbHVlcywgZiksXG4gICAgdW5pcXVlOiAgIHUsXG4gICAgY291bnQ6ICAgIHZhbHVlcy5sZW5ndGgsXG4gICAgdmFsaWQ6ICAgIHZhbGlkLFxuICAgIG1pc3Npbmc6ICBtaXNzaW5nLFxuICAgIGRpc3RpbmN0OiBkaXN0aW5jdCxcbiAgICBtaW46ICAgICAgbWluLFxuICAgIG1heDogICAgICBtYXgsXG4gICAgbWVhbjogICAgIG1lYW4sXG4gICAgc3RkZXY6ICAgIHNkLFxuICAgIG1lZGlhbjogICAodiA9IHN0YXRzLnF1YW50aWxlKHZhbHMsIDAuNSkpLFxuICAgIHExOiAgICAgICBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjI1KSxcbiAgICBxMzogICAgICAgc3RhdHMucXVhbnRpbGUodmFscywgMC43NSksXG4gICAgbW9kZXNrZXc6IHNkID09PSAwID8gMCA6IChtZWFuIC0gdikgLyBzZFxuICB9O1xufTtcblxuLy8gQ29tcHV0ZSBwcm9maWxlcyBmb3IgYWxsIHZhcmlhYmxlcyBpbiBhIGRhdGEgc2V0Llxuc3RhdHMuc3VtbWFyeSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkcykge1xuICBmaWVsZHMgPSBmaWVsZHMgfHwgdXRpbC5rZXlzKGRhdGFbMF0pO1xuICB2YXIgcyA9IGZpZWxkcy5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBwID0gc3RhdHMucHJvZmlsZShkYXRhLCB1dGlsLiQoZikpO1xuICAgIHJldHVybiAocC5maWVsZCA9IGYsIHApO1xuICB9KTtcbiAgcmV0dXJuIChzLl9fc3VtbWFyeV9fID0gdHJ1ZSwgcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRzO1xuIiwidmFyIGQzX3RpbWUgPSByZXF1aXJlKCdkMy10aW1lJyk7XG5cbnZhciB0ZW1wRGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgYmFzZURhdGUgPSBuZXcgRGF0ZSgwLCAwLCAxKS5zZXRGdWxsWWVhcigwKSwgLy8gSmFuIDEsIDAgQURcbiAgICB1dGNCYXNlRGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKDAsIDAsIDEpKS5zZXRVVENGdWxsWWVhcigwKTtcblxuZnVuY3Rpb24gZGF0ZShkKSB7XG4gIHJldHVybiAodGVtcERhdGUuc2V0VGltZSgrZCksIHRlbXBEYXRlKTtcbn1cblxuLy8gY3JlYXRlIGEgdGltZSB1bml0IGVudHJ5XG5mdW5jdGlvbiBlbnRyeSh0eXBlLCBkYXRlLCB1bml0LCBzdGVwLCBtaW4sIG1heCkge1xuICB2YXIgZSA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGU6IGRhdGUsXG4gICAgdW5pdDogdW5pdFxuICB9O1xuICBpZiAoc3RlcCkge1xuICAgIGUuc3RlcCA9IHN0ZXA7XG4gIH0gZWxzZSB7XG4gICAgZS5taW5zdGVwID0gMTtcbiAgfVxuICBpZiAobWluICE9IG51bGwpIGUubWluID0gbWluO1xuICBpZiAobWF4ICE9IG51bGwpIGUubWF4ID0gbWF4O1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKHR5cGUsIHVuaXQsIGJhc2UsIHN0ZXAsIG1pbiwgbWF4KSB7XG4gIHJldHVybiBlbnRyeSh0eXBlLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHVuaXQub2Zmc2V0KGJhc2UsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHVuaXQuY291bnQoYmFzZSwgZCk7IH0sXG4gICAgc3RlcCwgbWluLCBtYXgpO1xufVxuXG52YXIgbG9jYWxlID0gW1xuICBjcmVhdGUoJ3NlY29uZCcsIGQzX3RpbWUuc2Vjb25kLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnbWludXRlJywgZDNfdGltZS5taW51dGUsIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdob3VyJywgICBkM190aW1lLmhvdXIsICAgYmFzZURhdGUpLFxuICBjcmVhdGUoJ2RheScsICAgIGQzX3RpbWUuZGF5LCAgICBiYXNlRGF0ZSwgWzEsIDddKSxcbiAgY3JlYXRlKCdtb250aCcsICBkM190aW1lLm1vbnRoLCAgYmFzZURhdGUsIFsxLCAzLCA2XSksXG4gIGNyZWF0ZSgneWVhcicsICAgZDNfdGltZS55ZWFyLCAgIGJhc2VEYXRlKSxcblxuICAvLyBwZXJpb2RpYyB1bml0c1xuICBlbnRyeSgnc2Vjb25kcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRTZWNvbmRzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ21pbnV0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0TWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRIb3VycygpOyB9LFxuICAgIG51bGwsIDAsIDIzXG4gICksXG4gIGVudHJ5KCd3ZWVrZGF5cycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgNCtkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERheSgpOyB9LFxuICAgIFsxXSwgMCwgNlxuICApLFxuICBlbnRyeSgnZGF0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0RGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgZCAlIDEyLCAxKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1vbnRoKCk7IH0sXG4gICAgWzFdLCAwLCAxMVxuICApXG5dO1xuXG52YXIgdXRjID0gW1xuICBjcmVhdGUoJ3NlY29uZCcsIGQzX3RpbWUudXRjU2Vjb25kLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnbWludXRlJywgZDNfdGltZS51dGNNaW51dGUsIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdob3VyJywgICBkM190aW1lLnV0Y0hvdXIsICAgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ2RheScsICAgIGQzX3RpbWUudXRjRGF5LCAgICB1dGNCYXNlRGF0ZSwgWzEsIDddKSxcbiAgY3JlYXRlKCdtb250aCcsICBkM190aW1lLnV0Y01vbnRoLCAgdXRjQmFzZURhdGUsIFsxLCAzLCA2XSksXG4gIGNyZWF0ZSgneWVhcicsICAgZDNfdGltZS51dGNZZWFyLCAgIHV0Y0Jhc2VEYXRlKSxcblxuICAvLyBwZXJpb2RpYyB1bml0c1xuICBlbnRyeSgnc2Vjb25kcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDU2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNaW51dGVzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ2hvdXJzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENIb3VycygpOyB9LFxuICAgIG51bGwsIDAsIDIzXG4gICksXG4gIGVudHJ5KCd3ZWVrZGF5cycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgNCtkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENEYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENEYXRlKCk7IH0sXG4gICAgWzFdLCAxLCAzMVxuICApLFxuICBlbnRyeSgnbW9udGhzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCBkICUgMTIsIDEpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ01vbnRoKCk7IH0sXG4gICAgWzFdLCAwLCAxMVxuICApXG5dO1xuXG52YXIgU1RFUFMgPSBbXG4gIFszMTUzNmU2LCA1XSwgIC8vIDEteWVhclxuICBbNzc3NmU2LCA0XSwgICAvLyAzLW1vbnRoXG4gIFsyNTkyZTYsIDRdLCAgIC8vIDEtbW9udGhcbiAgWzEyMDk2ZTUsIDNdLCAgLy8gMi13ZWVrXG4gIFs2MDQ4ZTUsIDNdLCAgIC8vIDEtd2Vla1xuICBbMTcyOGU1LCAzXSwgICAvLyAyLWRheVxuICBbODY0ZTUsIDNdLCAgICAvLyAxLWRheVxuICBbNDMyZTUsIDJdLCAgICAvLyAxMi1ob3VyXG4gIFsyMTZlNSwgMl0sICAgIC8vIDYtaG91clxuICBbMTA4ZTUsIDJdLCAgICAvLyAzLWhvdXJcbiAgWzM2ZTUsIDJdLCAgICAgLy8gMS1ob3VyXG4gIFsxOGU1LCAxXSwgICAgIC8vIDMwLW1pbnV0ZVxuICBbOWU1LCAxXSwgICAgICAvLyAxNS1taW51dGVcbiAgWzNlNSwgMV0sICAgICAgLy8gNS1taW51dGVcbiAgWzZlNCwgMV0sICAgICAgLy8gMS1taW51dGVcbiAgWzNlNCwgMF0sICAgICAgLy8gMzAtc2Vjb25kXG4gIFsxNWUzLCAwXSwgICAgIC8vIDE1LXNlY29uZFxuICBbNWUzLCAwXSwgICAgICAvLyA1LXNlY29uZFxuICBbMWUzLCAwXSAgICAgICAvLyAxLXNlY29uZFxuXTtcblxuZnVuY3Rpb24gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yikge1xuICB2YXIgc3RlcCA9IFNURVBTWzBdLCBpLCBuLCBiaW5zO1xuXG4gIGZvciAoaT0xLCBuPVNURVBTLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBzdGVwID0gU1RFUFNbaV07XG4gICAgaWYgKHNwYW4gPiBzdGVwWzBdKSB7XG4gICAgICBiaW5zID0gc3BhbiAvIHN0ZXBbMF07XG4gICAgICBpZiAoYmlucyA+IG1heGIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW1NURVBTW2ktMV1bMV1dO1xuICAgICAgfVxuICAgICAgaWYgKGJpbnMgPj0gbWluYikge1xuICAgICAgICByZXR1cm4gdW5pdHNbc3RlcFsxXV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB1bml0c1tTVEVQU1tuLTFdWzFdXTtcbn1cblxuZnVuY3Rpb24gdG9Vbml0TWFwKHVuaXRzKSB7XG4gIHZhciBtYXAgPSB7fSwgaSwgbjtcbiAgZm9yIChpPTAsIG49dW5pdHMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIG1hcFt1bml0c1tpXS50eXBlXSA9IHVuaXRzW2ldO1xuICB9XG4gIG1hcC5maW5kID0gZnVuY3Rpb24oc3BhbiwgbWluYiwgbWF4Yikge1xuICAgIHJldHVybiBmaW5kKHVuaXRzLCBzcGFuLCBtaW5iLCBtYXhiKTtcbiAgfTtcbiAgcmV0dXJuIG1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1VuaXRNYXAobG9jYWxlKTtcbm1vZHVsZS5leHBvcnRzLnV0YyA9IHRvVW5pdE1hcCh1dGMpO1xuIiwidmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLFxuICAgIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgICB1dGMgPSB0aW1lLnV0YztcblxudmFyIHUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG52YXIgRk5BTUUgPSAnX19uYW1lX18nO1xuXG51Lm5hbWVkZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIGYpIHsgcmV0dXJuIChmW0ZOQU1FXSA9IG5hbWUsIGYpOyB9O1xuXG51Lm5hbWUgPSBmdW5jdGlvbihmKSB7IHJldHVybiBmPT1udWxsID8gbnVsbCA6IGZbRk5BTUVdOyB9O1xuXG51LmlkZW50aXR5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geDsgfTtcblxudS50cnVlID0gdS5uYW1lZGZ1bmMoJ3RydWUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0pO1xuXG51LmZhbHNlID0gdS5uYW1lZGZ1bmMoJ2ZhbHNlJywgZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfSk7XG5cbnUuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudS5lcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbn07XG5cbnUuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHgsIG5hbWUsIGk9MSwgbGVuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bGVuOyArK2kpIHtcbiAgICB4ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAobmFtZSBpbiB4KSB7IG9ialtuYW1lXSA9IHhbbmFtZV07IH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudS5sZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgeC5sZW5ndGggIT0gbnVsbCA/IHgubGVuZ3RoIDogbnVsbDtcbn07XG5cbnUua2V5cyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGtleXMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIGtleXMucHVzaChrKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG51LnZhbHMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciB2YWxzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSB2YWxzLnB1c2goeFtrXSk7XG4gIHJldHVybiB2YWxzO1xufTtcblxudS50b01hcCA9IGZ1bmN0aW9uKGxpc3QsIGYpIHtcbiAgcmV0dXJuIChmID0gdS4kKGYpKSA/XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW2YoeCldID0gMSwgb2JqKTsgfSwge30pIDpcbiAgICBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHsgcmV0dXJuIChvYmpbeF0gPSAxLCBvYmopOyB9LCB7fSk7XG59O1xuXG51LmtleXN0ciA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAvLyB1c2UgdG8gZW5zdXJlIGNvbnNpc3RlbnQga2V5IGdlbmVyYXRpb24gYWNyb3NzIG1vZHVsZXNcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBpZiAoIW4pIHJldHVybiAnJztcbiAgZm9yICh2YXIgcz1TdHJpbmcodmFsdWVzWzBdKSwgaT0xOyBpPG47ICsraSkge1xuICAgIHMgKz0gJ3wnICsgU3RyaW5nKHZhbHVlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIHM7XG59O1xuXG4vLyB0eXBlIGNoZWNraW5nIGZ1bmN0aW9uc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG51LmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxudS5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG51LmlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG51LmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudS5pc051bWJlciA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBOdW1iZXJdJztcbn07XG5cbnUuaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxudS5pc0RhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcblxudS5pc1ZhbGlkID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT09IG9iajtcbn07XG5cbnUuaXNCdWZmZXIgPSAoYnVmZmVyLkJ1ZmZlciAmJiBidWZmZXIuQnVmZmVyLmlzQnVmZmVyKSB8fCB1LmZhbHNlO1xuXG4vLyB0eXBlIGNvZXJjaW9uIGZ1bmN0aW9uc1xuXG51Lm51bWJlciA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiArcztcbn07XG5cbnUuYm9vbGVhbiA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBzPT09J2ZhbHNlJyA/IGZhbHNlIDogISFzO1xufTtcblxudS5kYXRlID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IERhdGUucGFyc2Uocyk7XG59O1xuXG51LmFycmF5ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsID8gKHUuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107XG59O1xuXG51LnN0ciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHUuaXNBcnJheSh4KSA/ICdbJyArIHgubWFwKHUuc3RyKSArICddJ1xuICAgIDogdS5pc09iamVjdCh4KSA/IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgOiB1LmlzU3RyaW5nKHgpID8gKCdcXCcnK3V0aWxfZXNjYXBlX3N0cih4KSsnXFwnJykgOiB4O1xufTtcblxudmFyIGVzY2FwZV9zdHJfcmUgPSAvKF58W15cXFxcXSknL2c7XG5cbmZ1bmN0aW9uIHV0aWxfZXNjYXBlX3N0cih4KSB7XG4gIHJldHVybiB4LnJlcGxhY2UoZXNjYXBlX3N0cl9yZSwgJyQxXFxcXFxcJycpO1xufVxuXG4vLyBkYXRhIGFjY2VzcyBmdW5jdGlvbnNcblxudmFyIGZpZWxkX3JlID0gL1xcWyguKj8pXFxdfFteLlxcW10rL2c7XG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikubWF0Y2goZmllbGRfcmUpLm1hcChmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGRbMF0gIT09ICdbJyA/IGQgOlxuICAgICAgZFsxXSAhPT0gXCInXCIgJiYgZFsxXSAhPT0gJ1wiJyA/IGQuc2xpY2UoMSwgLTEpIDpcbiAgICAgIGQuc2xpY2UoMiwgLTIpLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csICckMScpO1xuICB9KTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gZj09bnVsbCB8fCB1LmlzRnVuY3Rpb24oZikgPyBmIDpcbiAgICB1Lm5hbWVkZnVuYyhmLCAocyA9IHUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgICAgZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7IHJldHVybiB4W2ZdOyB9LCB4KTsgfSA6XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiB4W2ZdOyB9XG4gICAgKTtcbn07XG5cbi8vIHNob3J0LWN1dCBmb3IgYWNjZXNzb3JcbnUuJCA9IHUuYWNjZXNzb3I7XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgeFtzW2ldXSA9IHY7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxudS4kZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIG9wKSB7XG4gIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgZiA9IHUuJChmKSB8fCB1LmlkZW50aXR5O1xuICAgIHZhciBuID0gbmFtZSArICh1Lm5hbWUoZikgPyAnXycrdS5uYW1lKGYpIDogJycpO1xuICAgIHJldHVybiB1Lm5hbWVkZnVuYyhuLCBmdW5jdGlvbihkKSB7IHJldHVybiBvcChmKGQpKTsgfSk7XG4gIH07XG59O1xuXG51LiR2YWxpZCAgPSB1LiRmdW5jKCd2YWxpZCcsIHUuaXNWYWxpZCk7XG51LiRsZW5ndGggPSB1LiRmdW5jKCdsZW5ndGgnLCB1Lmxlbmd0aCk7XG5cbnUuJGluID0gZnVuY3Rpb24oZiwgdmFsdWVzKSB7XG4gIGYgPSB1LiQoZik7XG4gIHZhciBtYXAgPSB1LmlzQXJyYXkodmFsdWVzKSA/IHUudG9NYXAodmFsdWVzKSA6IHZhbHVlcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICEhbWFwW2YoZCldOyB9O1xufTtcblxudS4keWVhciAgID0gdS4kZnVuYygneWVhcicsIHRpbWUueWVhci51bml0KTtcbnUuJG1vbnRoICA9IHUuJGZ1bmMoJ21vbnRoJywgdGltZS5tb250aHMudW5pdCk7XG51LiRkYXRlICAgPSB1LiRmdW5jKCdkYXRlJywgdGltZS5kYXRlcy51bml0KTtcbnUuJGRheSAgICA9IHUuJGZ1bmMoJ2RheScsIHRpbWUud2Vla2RheXMudW5pdCk7XG51LiRob3VyICAgPSB1LiRmdW5jKCdob3VyJywgdGltZS5ob3Vycy51bml0KTtcbnUuJG1pbnV0ZSA9IHUuJGZ1bmMoJ21pbnV0ZScsIHRpbWUubWludXRlcy51bml0KTtcbnUuJHNlY29uZCA9IHUuJGZ1bmMoJ3NlY29uZCcsIHRpbWUuc2Vjb25kcy51bml0KTtcblxudS4kdXRjWWVhciAgID0gdS4kZnVuYygndXRjWWVhcicsIHV0Yy55ZWFyLnVuaXQpO1xudS4kdXRjTW9udGggID0gdS4kZnVuYygndXRjTW9udGgnLCB1dGMubW9udGhzLnVuaXQpO1xudS4kdXRjRGF0ZSAgID0gdS4kZnVuYygndXRjRGF0ZScsIHV0Yy5kYXRlcy51bml0KTtcbnUuJHV0Y0RheSAgICA9IHUuJGZ1bmMoJ3V0Y0RheScsIHV0Yy53ZWVrZGF5cy51bml0KTtcbnUuJHV0Y0hvdXIgICA9IHUuJGZ1bmMoJ3V0Y0hvdXInLCB1dGMuaG91cnMudW5pdCk7XG51LiR1dGNNaW51dGUgPSB1LiRmdW5jKCd1dGNNaW51dGUnLCB1dGMubWludXRlcy51bml0KTtcbnUuJHV0Y1NlY29uZCA9IHUuJGZ1bmMoJ3V0Y1NlY29uZCcsIHV0Yy5zZWNvbmRzLnVuaXQpO1xuXG4vLyBjb21wYXJpc29uIC8gc29ydGluZyBmdW5jdGlvbnNcblxudS5jb21wYXJhdG9yID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgc2lnbiA9IFtdO1xuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkKSBzb3J0ID0gW107XG4gIHNvcnQgPSB1LmFycmF5KHNvcnQpLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHMgPSAxO1xuICAgIGlmICAgICAgKGZbMF0gPT09ICctJykgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gJysnKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG51LnBhZCA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCBwYWRjaGFyKSB7XG4gIHBhZGNoYXIgPSBwYWRjaGFyIHx8IFwiIFwiO1xuICB2YXIgZCA9IGxlbmd0aCAtIHMubGVuZ3RoO1xuICBpZiAoZCA8PSAwKSByZXR1cm4gcztcbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBzdHJyZXAoZCwgcGFkY2hhcikgKyBzO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHJldHVybiBzdHJyZXAoTWF0aC5mbG9vcihkLzIpLCBwYWRjaGFyKSArXG4gICAgICAgICBzICsgc3RycmVwKE1hdGguY2VpbChkLzIpLCBwYWRjaGFyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHMgKyBzdHJyZXAoZCwgcGFkY2hhcik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cnJlcChuLCBzdHIpIHtcbiAgdmFyIHMgPSBcIlwiLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHMgKz0gc3RyO1xuICByZXR1cm4gcztcbn1cblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6ICdcXHUyMDI2JztcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICtcbiAgICAgICAgZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh0cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbignJykudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCJleHBvcnQgY29uc3QgQUdHUkVHQVRFX09QUyA9IFtcclxuICAndmFsdWVzJywgJ2NvdW50JywgJ3ZhbGlkJywgJ21pc3NpbmcnLCAnZGlzdGluY3QnLFxyXG4gICdzdW0nLCAnbWVhbicsICdhdmVyYWdlJywgJ3ZhcmlhbmNlJywgJ3ZhcmlhbmNlcCcsICdzdGRldicsXHJcbiAgJ3N0ZGV2cCcsICdtZWRpYW4nLCAncTEnLCAncTMnLCAnbW9kZXNrZXcnLCAnbWluJywgJ21heCcsXHJcbiAgJ2FyZ21pbicsICdhcmdtYXgnXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgU0hBUkVEX0RPTUFJTl9PUFMgPSBbXHJcbiAgJ21lYW4nLCAnYXZlcmFnZScsICdzdGRldicsICdzdGRldnAnLCAnbWVkaWFuJywgJ3ExJywgJ3EzJywgJ21pbicsICdtYXgnXHJcbl07XHJcblxyXG4vLyBUT0RPOiBtb3ZlIHN1cHBvcnRlZFR5cGVzLCBzdXBwb3J0ZWRFbnVtcyBmcm9tIHNjaGVtYSB0byBoZXJlXHJcbiIsImV4cG9ydCBjb25zdCBNQVhCSU5TX0RFRkFVTFQgPSAxNTtcclxuIiwiLypcclxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGVuY29kaW5nIGNoYW5uZWxzIChWaXN1YWwgdmFyaWFibGVzKVxyXG4gKiBzdWNoIGFzICd4JywgJ3knLCAnY29sb3InLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBYID0gJ3gnO1xyXG5leHBvcnQgY29uc3QgWSA9ICd5JztcclxuZXhwb3J0IGNvbnN0IFJPVyA9ICdyb3cnO1xyXG5leHBvcnQgY29uc3QgQ09MVU1OID0gJ2NvbHVtbic7XHJcbmV4cG9ydCBjb25zdCBTSEFQRSA9ICdzaGFwZSc7XHJcbmV4cG9ydCBjb25zdCBTSVpFID0gJ3NpemUnO1xyXG5leHBvcnQgY29uc3QgQ09MT1IgPSAnY29sb3InO1xyXG5leHBvcnQgY29uc3QgVEVYVCA9ICd0ZXh0JztcclxuZXhwb3J0IGNvbnN0IERFVEFJTCA9ICdkZXRhaWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IENIQU5ORUxTID0gW1gsIFksIFJPVywgQ09MVU1OLCBTSVpFLCBTSEFQRSwgQ09MT1IsIFRFWFQsIERFVEFJTF07XHJcblxyXG5leHBvcnQgdHlwZSBDaGFubmVsID0gc3RyaW5nO1xyXG5cclxuaW50ZXJmYWNlIFN1cHBvcnRlZE1hcmt0eXBlIHtcclxuICBbbWFya3R5cGU6IHN0cmluZ106IGJvb2xlYW47XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3VwcG9ydE1hcmt0eXBlKGNoYW5uZWw6IENoYW5uZWwsIG1hcmt0eXBlKSB7XHJcbiAgcmV0dXJuICEhZ2V0U3VwcG9ydGVkTWFya3R5cGUoY2hhbm5lbClbbWFya3R5cGVdO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIGEgZGljdGlvbmFyeSBzaG93aW5nIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIG1hcmsgdHlwZS5cclxuICogQHBhcmFtICB7RW5jdHlwZS5UeXBlfSAgY2hhbm5lbFxyXG4gKiBAcmV0dXJuIHtTdXBwb3J0ZWRSb2xlfSBBIGRpY3Rpb25hcnkgbWFwcGluZyBtYXJrIHR5cGVzIHRvIGJvb2xlYW4gdmFsdWVzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN1cHBvcnRlZE1hcmt0eXBlKGNoYW5uZWw6IENoYW5uZWwpOiBTdXBwb3J0ZWRNYXJrdHlwZSB7XHJcbiAgc3dpdGNoIChjaGFubmVsKSB7XHJcbiAgICBjYXNlIFg6XHJcbiAgICBjYXNlIFk6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlICxcclxuICAgICAgICBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWVcclxuICAgICAgfTtcclxuICAgIGNhc2UgUk9XOlxyXG4gICAgY2FzZSBDT0xVTU46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLFxyXG4gICAgICAgIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgdGV4dDogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBTSVpFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSxcclxuICAgICAgICBiYXI6IHRydWUsIHRleHQ6IHRydWVcclxuICAgICAgfTtcclxuICAgIGNhc2UgQ09MT1I6XHJcbiAgICBjYXNlIERFVEFJTDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsXHJcbiAgICAgICAgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCB0ZXh0OiB0cnVlXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIFNIQVBFOlxyXG4gICAgICByZXR1cm4ge3BvaW50OiB0cnVlfTtcclxuICAgIGNhc2UgVEVYVDpcclxuICAgICAgcmV0dXJuIHt0ZXh0OiB0cnVlfTtcclxuICB9XHJcbiAgcmV0dXJuIHt9O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgU3VwcG9ydGVkUm9sZSB7XHJcbiAgW3JvbGU6c3RyaW5nXTpib29sZWFuO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBkaW1lbnNpb24gLyBtZWFzdXJlIHJvbGVcclxuICogQHBhcmFtICB7RW5jdHlwZS5UeXBlfSAgY2hhbm5lbFxyXG4gKiBAcmV0dXJuIHtTdXBwb3J0ZWRSb2xlfSBBIGRpY3Rpb25hcnkgbWFwcGluZyByb2xlIHRvIGJvb2xlYW4gdmFsdWVzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN1cHBvcnRlZFJvbGUoY2hhbm5lbDogQ2hhbm5lbCk6IFN1cHBvcnRlZFJvbGUge1xyXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xyXG4gICAgY2FzZSBYOlxyXG4gICAgY2FzZSBZOlxyXG4gICAgY2FzZSBDT0xPUjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtZWFzdXJlOiB0cnVlLFxyXG4gICAgICAgIGRpbWVuc2lvbjogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBST1c6XHJcbiAgICBjYXNlIENPTFVNTjpcclxuICAgIGNhc2UgU0hBUEU6XHJcbiAgICBjYXNlIERFVEFJTDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtZWFzdXJlOiBmYWxzZSxcclxuICAgICAgICBkaW1lbnNpb246IHRydWVcclxuICAgICAgfTtcclxuICAgIGNhc2UgU0laRTpcclxuICAgIGNhc2UgVEVYVDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtZWFzdXJlOiB0cnVlLFxyXG4gICAgICAgIGRpbWVuc2lvbjogZmFsc2VcclxuICAgICAgfTtcclxuICB9XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGVuY29kaW5nIGNoYW5uZWwnICsgY2hhbm5lbCk7XHJcbn1cclxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcclxuaW1wb3J0IHtCaW59IGZyb20gJy4uL3NjaGVtYS9iaW4uc2NoZW1hJztcclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XHJcblxyXG5pbXBvcnQge01BWEJJTlNfREVGQVVMVH0gZnJvbSAnLi4vYmluJztcclxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgQ09MT1IsIERFVEFJTCwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XHJcbmltcG9ydCB7U09VUkNFLCBTVU1NQVJZfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XHJcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi4vZW5jb2RpbmcnO1xyXG5pbXBvcnQge2NvbXBpbGVMYXlvdXR9IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0IHtBUkVBLCBCQVJ9IGZyb20gJy4uL21hcmt0eXBlJztcclxuaW1wb3J0ICogYXMgc2NoZW1hIGZyb20gJy4uL3NjaGVtYS9zY2hlbWEnO1xyXG5pbXBvcnQgKiBhcyBzY2hlbWFVdGlsIGZyb20gJy4uL3NjaGVtYS9zY2hlbWF1dGlsJztcclxuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xyXG5pbXBvcnQge2dldEZ1bGxOYW1lLCBOT01JTkFMLCBPUkRJTkFMLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XHJcbmltcG9ydCB7Y29udGFpbnMsIGR1cGxpY2F0ZX0gZnJvbSAnLi4vdXRpbCc7XHJcbmltcG9ydCAqIGFzIHRpbWUgZnJvbSAnLi90aW1lJztcclxuXHJcblxyXG5pbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xyXG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xyXG4gIG5vZm4/OiBib29sZWFuO1xyXG4gIC8qKiBleGNsdWRlIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICovXHJcbiAgbm9BZ2dyZWdhdGU/OiBib29sZWFuO1xyXG4gIC8qKiBpbmNsdWRlICdkYXR1bS4nICovXHJcbiAgZGF0dW0/OiBib29sZWFuO1xyXG4gIC8qKiByZXBsYWNlIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xyXG4gIGZuPzogc3RyaW5nO1xyXG4gIC8qKiBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xyXG4gIHByZWZuPzogc3RyaW5nO1xyXG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgZm9yIGJpbiAoZGVmYXVsdD0nX3N0YXJ0JykgKi9cclxuICBiaW5TdWZmaXg/OiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogSW50ZXJuYWwgbW9kZWwgb2YgVmVnYS1MaXRlIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb21waWxlci5cclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWwge1xyXG4gIF9zcGVjOiBTcGVjO1xyXG4gIF9zdGFjazogU3RhY2tQcm9wZXJ0aWVzO1xyXG4gIF9sYXlvdXQ6IGFueTtcclxuXHJcbiAgLy8gVE9ETzogaW5jbHVkZSBfc3RhY2ssIF9sYXlvdXQsIF9zdHlsZSwgZXRjLlxyXG5cclxuICBjb25zdHJ1Y3RvcihzcGVjOiBTcGVjLCB0aGVtZT8pIHtcclxuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xyXG4gICAgdGhpcy5fc3BlYyA9IHNjaGVtYVV0aWwubWVyZ2UoZGVmYXVsdHMsIHRoZW1lIHx8IHt9LCBzcGVjKTtcclxuXHJcbiAgICAvLyBjb252ZXJ0IHNob3J0IHR5cGUgdG8gZnVsbCB0eXBlXHJcbiAgICB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgICAgIGlmIChmaWVsZERlZi50eXBlKSB7XHJcbiAgICAgICAgZmllbGREZWYudHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgc3RhY2tcclxuICAgIHRoaXMuX3N0YWNrID0gdGhpcy5nZXRTdGFja1Byb3BlcnRpZXMoKTtcclxuICAgIHRoaXMuX2xheW91dCA9IGNvbXBpbGVMYXlvdXQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFN0YWNrUHJvcGVydGllcygpOiBTdGFja1Byb3BlcnRpZXMge1xyXG4gICAgdmFyIHN0YWNrQ2hhbm5lbCA9ICh0aGlzLmhhcyhDT0xPUikpID8gQ09MT1IgOiAodGhpcy5oYXMoREVUQUlMKSkgPyBERVRBSUwgOiBudWxsO1xyXG5cclxuICAgIGlmIChzdGFja0NoYW5uZWwgJiZcclxuICAgICAgICAodGhpcy5pcyhCQVIpIHx8IHRoaXMuaXMoQVJFQSkpICYmXHJcbiAgICAgICAgdGhpcy5jb25maWcoJ3N0YWNrJykgIT09IGZhbHNlICYmXHJcbiAgICAgICAgdGhpcy5pc0FnZ3JlZ2F0ZSgpKSB7XHJcbiAgICAgIHZhciBpc1hNZWFzdXJlID0gdGhpcy5pc01lYXN1cmUoWCk7XHJcbiAgICAgIHZhciBpc1lNZWFzdXJlID0gdGhpcy5pc01lYXN1cmUoWSk7XHJcblxyXG4gICAgICBpZiAoaXNYTWVhc3VyZSAmJiAhaXNZTWVhc3VyZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBncm91cGJ5Q2hhbm5lbDogWSxcclxuICAgICAgICAgIGZpZWxkQ2hhbm5lbDogWCxcclxuICAgICAgICAgIHN0YWNrQ2hhbm5lbDogc3RhY2tDaGFubmVsLFxyXG4gICAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZygnc3RhY2snKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNZTWVhc3VyZSAmJiAhaXNYTWVhc3VyZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBncm91cGJ5Q2hhbm5lbDogWCxcclxuICAgICAgICAgIGZpZWxkQ2hhbm5lbDogWSxcclxuICAgICAgICAgIHN0YWNrQ2hhbm5lbDogc3RhY2tDaGFubmVsLFxyXG4gICAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZygnc3RhY2snKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgbGF5b3V0KCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0O1xyXG4gIH1cclxuXHJcbiAgc3RhY2soKTogU3RhY2tQcm9wZXJ0aWVzIHtcclxuICAgIHJldHVybiB0aGlzLl9zdGFjaztcclxuICB9XHJcblxyXG4gIHRvU3BlYyhleGNsdWRlQ29uZmlnPywgZXhjbHVkZURhdGE/KSB7XHJcbiAgICB2YXIgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5lbmNvZGluZyksXHJcbiAgICAgIHNwZWM6IGFueTtcclxuXHJcbiAgICBzcGVjID0ge1xyXG4gICAgICBtYXJrdHlwZTogdGhpcy5fc3BlYy5tYXJrdHlwZSxcclxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xyXG4gICAgICBzcGVjLmNvbmZpZyA9IGR1cGxpY2F0ZSh0aGlzLl9zcGVjLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFleGNsdWRlRGF0YSkge1xyXG4gICAgICBzcGVjLmRhdGEgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcclxuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xyXG4gICAgcmV0dXJuIHNjaGVtYVV0aWwuc3VidHJhY3Qoc3BlYywgZGVmYXVsdHMpO1xyXG4gIH1cclxuXHJcbiAgbWFya3R5cGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5tYXJrdHlwZTtcclxuICB9XHJcblxyXG4gIGlzKG0pIHtcclxuICAgIHJldHVybiB0aGlzLl9zcGVjLm1hcmt0eXBlID09PSBtO1xyXG4gIH1cclxuXHJcbiAgaGFzKGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fc3BlYy5lbmNvZGluZywgY2hhbm5lbClcclxuICAgIHJldHVybiB0aGlzLl9zcGVjLmVuY29kaW5nW2NoYW5uZWxdLmZpZWxkICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBmaWVsZERlZihjaGFubmVsOiBDaGFubmVsKTogRmllbGREZWYge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF07XHJcbiAgfVxyXG5cclxuICAvLyBnZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYVxyXG4gIGZpZWxkKGNoYW5uZWw6IENoYW5uZWwsIG9wdD86IEZpZWxkUmVmT3B0aW9uKSB7XHJcbiAgICBvcHQgPSBvcHQgfHwge307XHJcblxyXG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xyXG5cclxuICAgIHZhciBmID0gKG9wdC5kYXR1bSA/ICdkYXR1bS4nIDogJycpICsgKG9wdC5wcmVmbiB8fCAnJyksXHJcbiAgICAgIGZpZWxkID0gZmllbGREZWYuZmllbGQ7XHJcblxyXG4gICAgaWYgKHZsRmllbGREZWYuaXNDb3VudChmaWVsZERlZikpIHtcclxuICAgICAgcmV0dXJuIGYgKyAnY291bnQnO1xyXG4gICAgfSBlbHNlIGlmIChvcHQuZm4pIHtcclxuICAgICAgcmV0dXJuIGYgKyBvcHQuZm4gKyAnXycgKyBmaWVsZDtcclxuICAgIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmIGZpZWxkRGVmLmJpbikge1xyXG4gICAgICB2YXIgYmluU3VmZml4ID0gb3B0LmJpblN1ZmZpeCB8fCAnX3N0YXJ0JztcclxuICAgICAgcmV0dXJuIGYgKyAnYmluXycgKyBmaWVsZCArIGJpblN1ZmZpeDtcclxuICAgIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmICFvcHQubm9BZ2dyZWdhdGUgJiYgZmllbGREZWYuYWdncmVnYXRlKSB7XHJcbiAgICAgIHJldHVybiBmICsgZmllbGREZWYuYWdncmVnYXRlICsgJ18nICsgZmllbGQ7XHJcbiAgICB9IGVsc2UgaWYgKCFvcHQubm9mbiAmJiBmaWVsZERlZi50aW1lVW5pdCkge1xyXG4gICAgICByZXR1cm4gZiArIGZpZWxkRGVmLnRpbWVVbml0ICsgJ18nICsgZmllbGQ7XHJcbiAgICB9ICBlbHNlIHtcclxuICAgICAgcmV0dXJuIGYgKyBmaWVsZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZpZWxkVGl0bGUoY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgaWYgKHZsRmllbGREZWYuaXNDb3VudCh0aGlzLl9zcGVjLmVuY29kaW5nW2NoYW5uZWxdKSkge1xyXG4gICAgICByZXR1cm4gdmxGaWVsZERlZi5DT1VOVF9ESVNQTEFZTkFNRTtcclxuICAgIH1cclxuICAgIHZhciBmbiA9IHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0uYWdncmVnYXRlIHx8IHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0udGltZVVuaXQgfHwgKHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0uYmluICYmICdiaW4nKTtcclxuICAgIGlmIChmbikge1xyXG4gICAgICByZXR1cm4gZm4udG9VcHBlckNhc2UoKSArICcoJyArIHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0uZmllbGQgKyAnKSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXS5maWVsZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJldHVybnMgZmFsc2UgaWYgYmlubmluZyBpcyBkaXNhYmxlZCwgb3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGJpbm5pbmcgcHJvcGVydGllc1xyXG4gIGJpbihjaGFubmVsOiBDaGFubmVsKTogQmluIHwgYm9vbGVhbiB7XHJcbiAgICB2YXIgYmluID0gdGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXS5iaW47XHJcbiAgICBpZiAoYmluID09PSB7fSlcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKGJpbiA9PT0gdHJ1ZSlcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtYXhiaW5zOiBNQVhCSU5TX0RFRkFVTFRcclxuICAgICAgfTtcclxuICAgIHJldHVybiBiaW47XHJcbiAgfVxyXG5cclxuICBudW1iZXJGb3JtYXQgPSBmdW5jdGlvbihjaGFubmVsPzogQ2hhbm5lbCkge1xyXG4gICAgLy8gVE9ETygjNDk3KTogaGF2ZSBkaWZmZXJlbnQgbnVtYmVyIGZvcm1hdCBiYXNlZCBvbiBudW1iZXJUeXBlIChkaXNjcmV0ZS9jb250aW51b3VzKVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnKCdudW1iZXJGb3JtYXQnKTtcclxuICB9O1xyXG5cclxuICBtYXAoZikge1xyXG4gICAgcmV0dXJuIHZsRW5jb2RpbmcubWFwKHRoaXMuX3NwZWMuZW5jb2RpbmcsIGYpO1xyXG4gIH1cclxuXHJcbiAgcmVkdWNlKGYsIGluaXQpIHtcclxuICAgIHJldHVybiB2bEVuY29kaW5nLnJlZHVjZSh0aGlzLl9zcGVjLmVuY29kaW5nLCBmLCBpbml0KTtcclxuICB9XHJcblxyXG4gIGZvckVhY2goZikge1xyXG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuZm9yRWFjaCh0aGlzLl9zcGVjLmVuY29kaW5nLCBmKTtcclxuICB9XHJcblxyXG4gIGlzT3JkaW5hbFNjYWxlKGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcclxuICAgIHJldHVybiBmaWVsZERlZiAmJiAoXHJcbiAgICAgIGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgfHxcclxuICAgICAgKCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBmaWVsZERlZi50aW1lVW5pdCAmJlxyXG4gICAgICAgIHRpbWUuc2NhbGUudHlwZShmaWVsZERlZi50aW1lVW5pdCwgY2hhbm5lbCkgPT09ICdvcmRpbmFsJyApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaXNEaW1lbnNpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGFzKGNoYW5uZWwpICYmXHJcbiAgICAgIHZsRmllbGREZWYuaXNEaW1lbnNpb24odGhpcy5maWVsZERlZihjaGFubmVsKSk7XHJcbiAgfVxyXG5cclxuICBpc01lYXN1cmUoY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGFzKGNoYW5uZWwpICYmXHJcbiAgICAgIHZsRmllbGREZWYuaXNNZWFzdXJlKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xyXG4gIH1cclxuXHJcbiAgaXNBZ2dyZWdhdGUoKSB7XHJcbiAgICByZXR1cm4gdmxFbmNvZGluZy5pc0FnZ3JlZ2F0ZSh0aGlzLl9zcGVjLmVuY29kaW5nKTtcclxuICB9XHJcblxyXG4gIGlzRmFjZXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXMoUk9XKSB8fCB0aGlzLmhhcyhDT0xVTU4pO1xyXG4gIH1cclxuXHJcbiAgZGF0YVRhYmxlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNBZ2dyZWdhdGUoKSA/IFNVTU1BUlkgOiBTT1VSQ0U7XHJcbiAgfVxyXG5cclxuICBkYXRhKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NwZWMuZGF0YTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybnMgd2hldGhlciB0aGUgZW5jb2RpbmcgaGFzIHZhbHVlcyBlbWJlZGRlZFxyXG4gIGhhc1ZhbHVlcygpIHtcclxuICAgIHZhciB2YWxzID0gdGhpcy5kYXRhKCkudmFsdWVzO1xyXG4gICAgcmV0dXJuIHZhbHMgJiYgdmFscy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBjb25maWcobmFtZTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5jb25maWdbbmFtZV07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xyXG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmQsIHRydW5jYXRlfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcclxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XHJcbmltcG9ydCAqIGFzIHRpbWUgZnJvbSAnLi90aW1lJztcclxuXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xyXG5kZWNsYXJlIHZhciBleHBvcnRzO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVBeGlzKGNoYW5uZWw6IENoYW5uZWwsIG1vZGVsOiBNb2RlbCkge1xyXG4gIHZhciBpc0NvbCA9IGNoYW5uZWwgPT09IENPTFVNTixcclxuICAgIGlzUm93ID0gY2hhbm5lbCA9PT0gUk9XLFxyXG4gICAgdHlwZSA9IGlzQ29sID8gJ3gnIDogaXNSb3cgPyAneSc6IGNoYW5uZWw7XHJcblxyXG4gIC8vIFRPRE86IHJlbmFtZSBkZWYgdG8gYXhpc0RlZiBhbmQgYXZvaWQgc2lkZSBlZmZlY3RzIHdoZXJlIHBvc3NpYmxlLlxyXG4gIC8vIFRPRE86IHJlcGxhY2UgYW55IHdpdGggVmVnYSBBeGlzIEludGVyZmFjZVxyXG4gIHZhciBkZWY6YW55ID0ge1xyXG4gICAgdHlwZTogdHlwZSxcclxuICAgIHNjYWxlOiBjaGFubmVsXHJcbiAgfTtcclxuXHJcbiAgLy8gMS4gQWRkIHByb3BlcnRpZXNcclxuICBbXHJcbiAgICAvLyBhKSBwcm9wZXJ0aWVzIHdpdGggc3BlY2lhbCBydWxlcyAoc28gaXQgaGFzIGF4aXNbcHJvcGVydHldIG1ldGhvZHMpIC0tIGNhbGwgcnVsZSBmdW5jdGlvbnNcclxuICAgICdmb3JtYXQnLCAnZ3JpZCcsICdsYXllcicsICdvZmZzZXQnLCAnb3JpZW50JywgJ3RpY2tTaXplJywgJ3RpY2tzJywgJ3RpdGxlJyxcclxuICAgIC8vIGIpIHByb3BlcnRpZXMgd2l0aG91dCBydWxlcywgb25seSBwcm9kdWNlIGRlZmF1bHQgdmFsdWVzIGluIHRoZSBzY2hlbWEsIG9yIGV4cGxpY2l0IHZhbHVlIGlmIHNwZWNpZmllZFxyXG4gICAgJ3RpY2tQYWRkaW5nJywgJ3RpY2tTaXplJywgJ3RpY2tTaXplTWFqb3InLCAndGlja1NpemVNaW5vcicsICd0aWNrU2l6ZUVuZCcsXHJcbiAgICAndGl0bGVPZmZzZXQnLCAndmFsdWVzJywgJ3N1YmRpdmlkZSdcclxuICBdLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuICAgIGxldCBtZXRob2Q6IChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGRlZjphbnkpPT5hbnk7XHJcblxyXG4gICAgdmFyIHZhbHVlID0gKG1ldGhvZCA9IGV4cG9ydHNbcHJvcGVydHldKSA/XHJcbiAgICAgICAgICAgICAgICAgIC8vIGNhbGxpbmcgYXhpcy5mb3JtYXQsIGF4aXMuZ3JpZCwgLi4uXHJcbiAgICAgICAgICAgICAgICAgIG1ldGhvZChtb2RlbCwgY2hhbm5lbCwgZGVmKSA6XHJcbiAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXNbcHJvcGVydHldO1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZGVmW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xyXG4gIHZhciBwcm9wcyA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXMucHJvcGVydGllcyB8fCB7fTtcclxuXHJcbiAgW1xyXG4gICAgJ2F4aXMnLCAnbGFiZWxzJywvLyBoYXZlIHNwZWNpYWwgcnVsZXNcclxuICAgICdncmlkJywgJ3RpdGxlJywgJ3RpY2tzJywgJ21ham9yVGlja3MnLCAnbWlub3JUaWNrcycgLy8gb25seSBkZWZhdWx0IHZhbHVlc1xyXG4gIF0uZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xyXG4gICAgdmFyIHZhbHVlID0gcHJvcGVydGllc1tncm91cF0gP1xyXG4gICAgICBwcm9wZXJ0aWVzW2dyb3VwXShtb2RlbCwgY2hhbm5lbCwgcHJvcHNbZ3JvdXBdLCBkZWYpIDpcclxuICAgICAgcHJvcHNbZ3JvdXBdO1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fTtcclxuICAgICAgZGVmLnByb3BlcnRpZXNbZ3JvdXBdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBkZWY7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuICB2YXIgZm9ybWF0ID0gZmllbGREZWYuYXhpcy5mb3JtYXQ7XHJcbiAgaWYgKGZvcm1hdCAhPT0gdW5kZWZpbmVkKSAge1xyXG4gICAgcmV0dXJuIGZvcm1hdDtcclxuICB9XHJcblxyXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcclxuICAgIHJldHVybiBtb2RlbC5udW1iZXJGb3JtYXQoY2hhbm5lbCk7XHJcbiAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xyXG4gICAgY29uc3QgdGltZVVuaXQgPSBmaWVsZERlZi50aW1lVW5pdDtcclxuICAgIGlmICghdGltZVVuaXQpIHtcclxuICAgICAgcmV0dXJuIG1vZGVsLmNvbmZpZygndGltZUZvcm1hdCcpO1xyXG4gICAgfSBlbHNlIGlmICh0aW1lVW5pdCA9PT0gJ3llYXInKSB7XHJcbiAgICAgIHJldHVybiAnZCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBncmlkKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XHJcbiAgdmFyIGdyaWQgPSBmaWVsZERlZi5heGlzLmdyaWQ7XHJcbiAgaWYgKGdyaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGdyaWQ7XHJcbiAgfVxyXG5cclxuICAvLyBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3Igb3JkaW5hbCBzY2FsZXNcclxuICAvLyB0aGF0IGFyZSBub3QgYmlubmVkXHJcbiAgcmV0dXJuICFtb2RlbC5pc09yZGluYWxTY2FsZShjaGFubmVsKSAmJiAhZmllbGREZWYuYmluO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXIobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWYpIHtcclxuICB2YXIgbGF5ZXIgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5heGlzLmxheWVyO1xyXG4gIGlmIChsYXllciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gbGF5ZXI7XHJcbiAgfVxyXG4gIGlmIChkZWYuZ3JpZCkge1xyXG4gICAgLy8gaWYgZ3JpZCBpcyB0cnVlLCBuZWVkIHRvIHB1dCBsYXllciBvbiB0aGUgYmFjayBzbyB0aGF0IGdyaWQgaXMgYmVoaW5kIG1hcmtzXHJcbiAgICByZXR1cm4gJ2JhY2snO1xyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkOyAvLyBvdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgdXNlIFZlZ2EncyBkZWZhdWx0LlxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9mZnNldChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGRlZikge1xyXG4gIGNvbnN0IG9mZnNldCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXMub2Zmc2V0O1xyXG4gIGlmIChvZmZzZXQpIHtcclxuICAgIHJldHVybiBvZmZzZXQ7XHJcbiAgfVxyXG4gIGlmICgoY2hhbm5lbCA9PT0gUk9XICYmICFtb2RlbC5oYXMoWSkpIHx8XHJcbiAgICAgIChjaGFubmVsID09PSBDT0xVTU4gJiYgIW1vZGVsLmhhcyhYKSlcclxuICAgICkge1xyXG4gICAgcmV0dXJuIG1vZGVsLmNvbmZpZygnY2VsbCcpLmdyaWRPZmZzZXQ7XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvcmllbnQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgdmFyIG9yaWVudCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXMub3JpZW50O1xyXG4gIGlmIChvcmllbnQpIHtcclxuICAgIHJldHVybiBvcmllbnQ7XHJcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBDT0xVTU4pIHtcclxuICAgIC8vIEZJWE1FIHRlc3QgYW5kIGRlY2lkZVxyXG4gICAgcmV0dXJuICd0b3AnO1xyXG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gUk9XKSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMub3JpZW50ICE9PSAncmlnaHQnKSB7XHJcbiAgICAgIHJldHVybiAncmlnaHQnO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGlja3MobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgY29uc3QgdGlja3MgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5heGlzLnRpY2tzO1xyXG4gIGlmICh0aWNrcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gdGlja3M7XHJcbiAgfVxyXG5cclxuICAvLyBGSVhNRSBkZXBlbmRzIG9uIHNjYWxlIHR5cGUgdG9vXHJcbiAgaWYgKGNoYW5uZWwgPT09IFggJiYgIW1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmJpbikge1xyXG4gICAgcmV0dXJuIDU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGlja1NpemUobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgY29uc3QgdGlja1NpemUgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5heGlzLnRpY2tTaXplO1xyXG4gIGlmICh0aWNrU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gdGlja1NpemU7XHJcbiAgfVxyXG4gIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICB2YXIgYXhpc1NwZWMgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5heGlzO1xyXG4gIGlmIChheGlzU3BlYy50aXRsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gYXhpc1NwZWMudGl0bGU7XHJcbiAgfVxyXG5cclxuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxyXG4gIHZhciBmaWVsZFRpdGxlID0gbW9kZWwuZmllbGRUaXRsZShjaGFubmVsKTtcclxuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcclxuXHJcbiAgdmFyIG1heExlbmd0aDtcclxuICBpZiAoYXhpc1NwZWMudGl0bGVNYXhMZW5ndGgpIHtcclxuICAgIG1heExlbmd0aCA9IGF4aXNTcGVjLnRpdGxlTWF4TGVuZ3RoO1xyXG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWCAmJiB0eXBlb2YgbGF5b3V0LmNlbGxXaWR0aCA9PT0gJ251bWJlcicpIHtcclxuICAgIC8vIEd1ZXNzIG1heCBsZW5ndGggaWYgd2Uga25vdyBjZWxsIHNpemUgYXQgY29tcGlsZSB0aW1lXHJcbiAgICBtYXhMZW5ndGggPSBsYXlvdXQuY2VsbFdpZHRoIC8gbW9kZWwuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpO1xyXG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWSAmJiB0eXBlb2YgbGF5b3V0LmNlbGxIZWlnaHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAvLyBHdWVzcyBtYXggbGVuZ3RoIGlmIHdlIGtub3cgY2VsbCBzaXplIGF0IGNvbXBpbGUgdGltZVxyXG4gICAgbWF4TGVuZ3RoID0gbGF5b3V0LmNlbGxIZWlnaHQgLyBtb2RlbC5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcclxuICBleHBvcnQgZnVuY3Rpb24gYXhpcyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNwZWMpIHtcclxuICAgIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XHJcbiAgICAgIC8vIGhpZGUgYXhpcyBmb3IgZmFjZXRzXHJcbiAgICAgIHJldHVybiBleHRlbmQoe1xyXG4gICAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cclxuICAgICAgfSwgc3BlYyB8fCB7fSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3BlYyB8fCB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc3BlYywgZGVmKSB7XHJcbiAgICBsZXQgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuICAgIHZhciBmaWx0ZXJOYW1lID0gdGltZS5sYWJlbFRlbXBsYXRlKGZpZWxkRGVmLnRpbWVVbml0LCBmaWVsZERlZi5heGlzLnNob3J0VGltZU5hbWVzKTtcclxuICAgIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBmaWx0ZXJOYW1lKSB7XHJcbiAgICAgIHNwZWMgPSBleHRlbmQoe1xyXG4gICAgICAgIHRleHQ6IHt0ZW1wbGF0ZTogJ3t7ZGF0dW0uZGF0YSB8ICcgKyBmaWx0ZXJOYW1lICsgJ319J31cclxuICAgICAgfSwgc3BlYyB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgJiYgZmllbGREZWYuYXhpcy5sYWJlbE1heExlbmd0aCkge1xyXG4gICAgICAvLyBUT0RPIHJlcGxhY2UgdGhpcyB3aXRoIFZlZ2EncyBsYWJlbE1heExlbmd0aCBvbmNlIGl0IGlzIGludHJvZHVjZWRcclxuICAgICAgc3BlYyA9IGV4dGVuZCh7XHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgdGVtcGxhdGU6ICd7eyBkYXR1bS5kYXRhIHwgdHJ1bmNhdGU6JyArIGZpZWxkRGVmLmF4aXMubGFiZWxNYXhMZW5ndGggKyAnfX0nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBzcGVjIHx8IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICAgLy8gZm9yIHgtYXhpcywgc2V0IHRpY2tzIGZvciBRIG9yIHJvdGF0ZSBzY2FsZSBmb3Igb3JkaW5hbCBzY2FsZVxyXG4gICAgc3dpdGNoIChjaGFubmVsKSB7XHJcbiAgICAgIGNhc2UgWDpcclxuICAgICAgICBpZiAobW9kZWwuaXNEaW1lbnNpb24oWCkgfHwgZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcclxuICAgICAgICAgIHNwZWMgPSBleHRlbmQoe1xyXG4gICAgICAgICAgICBhbmdsZToge3ZhbHVlOiAyNzB9LFxyXG4gICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiBkZWYub3JpZW50ID09PSAndG9wJyA/ICdsZWZ0JzogJ3JpZ2h0J30sXHJcbiAgICAgICAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfVxyXG4gICAgICAgICAgfSwgc3BlYyB8fCB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFJPVzpcclxuICAgICAgICBpZiAoZGVmLm9yaWVudCA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgc3BlYyA9IGV4dGVuZCh7XHJcbiAgICAgICAgICAgIGFuZ2xlOiB7dmFsdWU6IDkwfSxcclxuICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9LFxyXG4gICAgICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnYm90dG9tJ31cclxuICAgICAgICAgIH0sIHNwZWMgfHwge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3BlYyB8fCB1bmRlZmluZWQ7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBNb2R1bGUgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cclxuICovXHJcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xyXG5cclxuaW1wb3J0IHtjb21waWxlQXhpc30gZnJvbSAnLi9heGlzJztcclxuaW1wb3J0IHtjb21waWxlRGF0YX0gZnJvbSAnLi9kYXRhJztcclxuaW1wb3J0IHtmYWNldE1peGluc30gZnJvbSAnLi9mYWNldCc7XHJcbmltcG9ydCB7Y29tcGlsZUxlZ2VuZHN9IGZyb20gJy4vbGVnZW5kJztcclxuaW1wb3J0IHtjb21waWxlTWFya3N9IGZyb20gJy4vbWFya3MnO1xyXG5pbXBvcnQge2NvbXBpbGVTY2FsZXN9IGZyb20gJy4vc2NhbGUnO1xyXG5pbXBvcnQgKiBhcyB2bFRpbWUgZnJvbSAnLi90aW1lJztcclxuaW1wb3J0IHtleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xyXG5cclxuaW1wb3J0IHtMQVlPVVR9IGZyb20gJy4uL2RhdGEnO1xyXG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XHJcblxyXG5leHBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKHNwZWMsIHRoZW1lPykge1xyXG4gIHZhciBtb2RlbCA9IG5ldyBNb2RlbChzcGVjLCB0aGVtZSk7XHJcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XHJcblxyXG4gIHZhciByb290R3JvdXA6YW55ID0ge1xyXG4gICAgbmFtZTogJ3Jvb3QnLFxyXG4gICAgdHlwZTogJ2dyb3VwJyxcclxuICAgIGZyb206IHtkYXRhOiBMQVlPVVR9LFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICB1cGRhdGU6IHtcclxuICAgICAgICB3aWR0aDogbGF5b3V0LndpZHRoLmZpZWxkID9cclxuICAgICAgICAgICAgICAge2ZpZWxkOiBsYXlvdXQud2lkdGguZmllbGR9IDpcclxuICAgICAgICAgICAgICAge3ZhbHVlOiBsYXlvdXQud2lkdGh9LFxyXG4gICAgICAgIGhlaWdodDogbGF5b3V0LmhlaWdodC5maWVsZCA/XHJcbiAgICAgICAgICAgICAgICB7ZmllbGQ6IGxheW91dC5oZWlnaHQuZmllbGR9IDpcclxuICAgICAgICAgICAgICAgIHt2YWx1ZTogbGF5b3V0LmhlaWdodH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1hcmtzID0gY29tcGlsZU1hcmtzKG1vZGVsKTtcclxuXHJcbiAgLy8gU21hbGwgTXVsdGlwbGVzXHJcbiAgaWYgKG1vZGVsLmhhcyhST1cpIHx8IG1vZGVsLmhhcyhDT0xVTU4pKSB7XHJcbiAgICAvLyBwdXQgdGhlIG1hcmtzIGluc2lkZSBhIGZhY2V0IGNlbGwncyBncm91cFxyXG4gICAgZXh0ZW5kKHJvb3RHcm91cCwgZmFjZXRNaXhpbnMobW9kZWwsIG1hcmtzKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJvb3RHcm91cC5tYXJrcyA9IG1hcmtzLm1hcChmdW5jdGlvbihtYXJrcykge1xyXG4gICAgICBtYXJrcy5mcm9tID0gbWFya3MuZnJvbSB8fCB7fTtcclxuICAgICAgbWFya3MuZnJvbS5kYXRhID0gbW9kZWwuZGF0YVRhYmxlKCk7XHJcbiAgICAgIHJldHVybiBtYXJrcztcclxuICAgIH0pO1xyXG4gICAgY29uc3Qgc2NhbGVOYW1lcyA9IG1vZGVsLm1hcChmdW5jdGlvbihfLCBjaGFubmVsOiBDaGFubmVsKXtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbDsgLy8gVE9ETyBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbClcclxuICAgICAgfSk7XHJcbiAgICByb290R3JvdXAuc2NhbGVzID0gY29tcGlsZVNjYWxlcyhzY2FsZU5hbWVzLCBtb2RlbCk7XHJcblxyXG4gICAgdmFyIGF4ZXMgPSAobW9kZWwuaGFzKFgpID8gW2NvbXBpbGVBeGlzKFgsIG1vZGVsKV0gOiBbXSlcclxuICAgICAgLmNvbmNhdChtb2RlbC5oYXMoWSkgPyBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXSA6IFtdKTtcclxuICAgIGlmIChheGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcm9vdEdyb3VwLmF4ZXMgPSBheGVzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbGVnZW5kcyAoc2ltaWxhciBmb3IgZWl0aGVyIGZhY2V0cyBvciBub24tZmFjZXRzXHJcbiAgdmFyIGxlZ2VuZHMgPSBjb21waWxlTGVnZW5kcyhtb2RlbCk7XHJcbiAgaWYgKGxlZ2VuZHMubGVuZ3RoID4gMCkge1xyXG4gICAgcm9vdEdyb3VwLmxlZ2VuZHMgPSBsZWdlbmRzO1xyXG4gIH1cclxuXHJcbiAgLy8gRklYTUUgcmVwbGFjZSBGSVQgd2l0aCBhcHByb3ByaWF0ZSBtZWNoYW5pc20gb25jZSBWZWdhIGhhcyBpdFxyXG4gIGNvbnN0IEZJVCA9IDE7XHJcbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xyXG4gIHZhciBvdXRwdXQgPSB7XHJcbiAgICAgIHdpZHRoOiBsYXlvdXQud2lkdGguZmllbGQgPyBGSVQgOiBsYXlvdXQud2lkdGgsXHJcbiAgICAgIGhlaWdodDogbGF5b3V0LmhlaWdodC5maWVsZCA/IEZJVCA6IGxheW91dC5oZWlnaHQsXHJcbiAgICAgIHBhZGRpbmc6ICdhdXRvJyxcclxuICAgICAgZGF0YTogY29tcGlsZURhdGEobW9kZWwpLFxyXG4gICAgICBtYXJrczogW3Jvb3RHcm91cF1cclxuICAgIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzcGVjOiBvdXRwdXRcclxuICAgIC8vIFRPRE86IGFkZCB3YXJuaW5nIC8gZXJyb3JzIGhlcmVcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi4vZmllbGRkZWYnO1xyXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xyXG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XHJcbmltcG9ydCB7U3RhY2tQcm9wZXJ0aWVzfSBmcm9tICcuL3N0YWNrJztcclxuXHJcbmltcG9ydCB7TUFYQklOU19ERUZBVUxUfSBmcm9tICcuLi9iaW4nO1xyXG5pbXBvcnQge0NoYW5uZWwsIFgsIFksIFJPVywgQ09MVU1OfSBmcm9tICcuLi9jaGFubmVsJztcclxuaW1wb3J0IHtTT1VSQ0UsIFNUQUNLRUQsIExBWU9VVCwgU1VNTUFSWX0gZnJvbSAnLi4vZGF0YSc7XHJcbmltcG9ydCAqIGFzIHRpbWUgZnJvbSAnLi90aW1lJztcclxuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgVmVnYSdzIGRhdGEgYXJyYXkgZnJvbSBhIGdpdmVuIGVuY29kaW5nLlxyXG4gKlxyXG4gKiBAcGFyYW0gIHtFbmNvZGluZ30gZW5jb2RpbmdcclxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIFZlZ2EgZGF0YS5cclxuICogICAgICAgICAgICAgICAgIFRoaXMgYWx3YXlzIGluY2x1ZGVzIGEgXCJzb3VyY2VcIiBkYXRhIHRhYmxlLlxyXG4gKiAgICAgICAgICAgICAgICAgSWYgdGhlIGVuY29kaW5nIGNvbnRhaW5zIGFnZ3JlZ2F0ZSB2YWx1ZSwgdGhpcyB3aWxsIGFsc28gY3JlYXRlXHJcbiAqICAgICAgICAgICAgICAgICBhZ2dyZWdhdGUgdGFibGUgYXMgd2VsbC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRGF0YShtb2RlbDogTW9kZWwpIHtcclxuICB2YXIgZGVmID0gW3NvdXJjZS5kZWYobW9kZWwpXTtcclxuXHJcbiAgY29uc3Qgc3VtbWFyeURlZiA9IHN1bW1hcnkuZGVmKG1vZGVsKTtcclxuICBpZiAoc3VtbWFyeURlZikge1xyXG4gICAgZGVmLnB1c2goc3VtbWFyeURlZik7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIGFkZCBcImhhdmluZ1wiIGZpbHRlciBoZXJlXHJcblxyXG4gIC8vIGFwcGVuZCBub24tcG9zaXRpdmUgZmlsdGVyIGF0IHRoZSBlbmQgZm9yIHRoZSBkYXRhIHRhYmxlXHJcbiAgZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGVmW2RlZi5sZW5ndGggLSAxXSwgbW9kZWwpO1xyXG5cclxuICAvLyBhZGQgc3RhdHMgZm9yIGxheW91dCBjYWxjdWxhdGlvblxyXG4gIGNvbnN0IHN0YXRzRGVmID0gbGF5b3V0LmRlZihtb2RlbCk7XHJcbiAgaWYoc3RhdHNEZWYpIHtcclxuICAgIGRlZi5wdXNoKHN0YXRzRGVmKTtcclxuICB9XHJcblxyXG4gIC8vIFN0YWNrXHJcbiAgY29uc3Qgc3RhY2tEZWYgPSBtb2RlbC5zdGFjaygpO1xyXG4gIGlmIChzdGFja0RlZikge1xyXG4gICAgZGVmLnB1c2goc3RhY2suZGVmKG1vZGVsLCBzdGFja0RlZikpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRlZjtcclxufVxyXG5cclxuLy8gVE9ETzogQ29uc29saWRhdGUgYWxsIFZlZ2EgaW50ZXJmYWNlXHJcbmludGVyZmFjZSBWZ0RhdGEge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBzb3VyY2U/OiBzdHJpbmc7XHJcbiAgdmFsdWVzPzogYW55O1xyXG4gIGZvcm1hdD86IGFueTtcclxuICB1cmw/OiBhbnk7XHJcbiAgdHJhbnNmb3JtPzogYW55O1xyXG59XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIHNvdXJjZSB7XHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xyXG4gICAgdmFyIHNvdXJjZTpWZ0RhdGEgPSB7bmFtZTogU09VUkNFfTtcclxuXHJcbiAgICAvLyBEYXRhIHNvdXJjZSAodXJsIG9yIGlubGluZSlcclxuICAgIGlmIChtb2RlbC5oYXNWYWx1ZXMoKSkge1xyXG4gICAgICBzb3VyY2UudmFsdWVzID0gbW9kZWwuZGF0YSgpLnZhbHVlcztcclxuICAgICAgc291cmNlLmZvcm1hdCA9IHt0eXBlOiAnanNvbid9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc291cmNlLnVybCA9IG1vZGVsLmRhdGEoKS51cmw7XHJcbiAgICAgIHNvdXJjZS5mb3JtYXQgPSB7dHlwZTogbW9kZWwuZGF0YSgpLmZvcm1hdFR5cGV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBkYXRhJ3MgZm9ybWF0LnBhcnNlIGlmIG5lZWRlZFxyXG4gICAgdmFyIHBhcnNlID0gZm9ybWF0UGFyc2UobW9kZWwpO1xyXG4gICAgaWYgKHBhcnNlKSB7XHJcbiAgICAgIHNvdXJjZS5mb3JtYXQucGFyc2UgPSBwYXJzZTtcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2UudHJhbnNmb3JtID0gdHJhbnNmb3JtKG1vZGVsKTtcclxuICAgIHJldHVybiBzb3VyY2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmb3JtYXRQYXJzZShtb2RlbDogTW9kZWwpIHtcclxuICAgIHZhciBwYXJzZTtcclxuXHJcbiAgICBtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmOiBGaWVsZERlZikge1xyXG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcclxuICAgICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xyXG4gICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdkYXRlJztcclxuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcclxuICAgICAgICBpZiAodmxGaWVsZERlZi5pc0NvdW50KGZpZWxkRGVmKSkgcmV0dXJuO1xyXG4gICAgICAgIHBhcnNlID0gcGFyc2UgfHwge307XHJcbiAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ251bWJlcic7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBwYXJzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIFZlZ2EgdHJhbnNmb3JtcyBmb3IgdGhlIHNvdXJjZSBkYXRhIHRhYmxlLiAgVGhpcyBjYW4gaW5jbHVkZVxyXG4gICAqIHRyYW5zZm9ybXMgZm9yIHRpbWUgdW5pdCwgYmlubmluZyBhbmQgZmlsdGVyaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XHJcbiAgICAvLyBudWxsIGZpbHRlciBjb21lcyBmaXJzdCBzbyB0cmFuc2Zvcm1zIGFyZSBub3QgcGVyZm9ybWVkIG9uIG51bGwgdmFsdWVzXHJcbiAgICAvLyB0aW1lIGFuZCBiaW4gc2hvdWxkIGNvbWUgYmVmb3JlIGZpbHRlciBzbyB3ZSBjYW4gZmlsdGVyIGJ5IHRpbWUgYW5kIGJpblxyXG4gICAgcmV0dXJuIG51bGxGaWx0ZXJUcmFuc2Zvcm0obW9kZWwpLmNvbmNhdChcclxuICAgICAgZm9ybXVsYVRyYW5zZm9ybShtb2RlbCksXHJcbiAgICAgIHRpbWVUcmFuc2Zvcm0obW9kZWwpLFxyXG4gICAgICBiaW5UcmFuc2Zvcm0obW9kZWwpLFxyXG4gICAgICBmaWx0ZXJUcmFuc2Zvcm0obW9kZWwpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHRpbWVUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XHJcbiAgICByZXR1cm4gbW9kZWwucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBmaWVsZERlZi50aW1lVW5pdCkge1xyXG4gICAgICAgIHZhciBmaWVsZCA9IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtub2ZuOiB0cnVlLCBkYXR1bTogdHJ1ZX0pO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXHJcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXHJcbiAgICAgICAgICBleHByOiB0aW1lLmZvcm11bGEoZmllbGREZWYudGltZVVuaXQsIGZpZWxkKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cmFuc2Zvcm07XHJcbiAgICB9LCBbXSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gYmluVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xyXG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgICBjb25zdCBiaW4gPSBtb2RlbC5iaW4oY2hhbm5lbCk7XHJcbiAgICAgIGlmIChiaW4pIHtcclxuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiAnYmluJyxcclxuICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZCxcclxuICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICBzdGFydDogbW9kZWwuZmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ19zdGFydCd9KSxcclxuICAgICAgICAgICAgbWlkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnX21pZCd9KSxcclxuICAgICAgICAgICAgZW5kOiBtb2RlbC5maWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnX2VuZCd9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1heGJpbnM6IHR5cGVvZiBiaW4gPT09ICdib29sZWFuJyA/IE1BWEJJTlNfREVGQVVMVCA6IGJpbi5tYXhiaW5zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICAgIH0sIFtdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSB0aGF0IG1pZ2h0IGNvbnRhaW4gYSBmaWx0ZXIgdHJhbnNmb3JtIGZvciBmaWx0ZXJpbmcgbnVsbCB2YWx1ZSBiYXNlZCBvbiBmaWx0ZXJOdWwgY29uZmlnXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIG51bGxGaWx0ZXJUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XHJcbiAgICBjb25zdCBmaWx0ZXJOdWxsID0gbW9kZWwuY29uZmlnKCdmaWx0ZXJOdWxsJyk7XHJcbiAgICBjb25zdCBmaWx0ZXJlZEZpZWxkcyA9IHV0aWwua2V5cyhtb2RlbC5yZWR1Y2UoZnVuY3Rpb24oZmlsdGVyZWRGaWVsZHMsIGZpZWxkRGVmOiBGaWVsZERlZikge1xyXG4gICAgICBpZiAoZmllbGREZWYuZmllbGQgJiYgZmllbGREZWYuZmllbGQgIT09ICcqJyAmJiBmaWx0ZXJOdWxsW2ZpZWxkRGVmLnR5cGVdKSB7XHJcbiAgICAgICAgZmlsdGVyZWRGaWVsZHNbZmllbGREZWYuZmllbGRdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmlsdGVyZWRGaWVsZHM7XHJcbiAgICB9LCB7fSkpO1xyXG5cclxuICAgIHJldHVybiBmaWx0ZXJlZEZpZWxkcy5sZW5ndGggPiAwID9cclxuICAgICAgW3tcclxuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcclxuICAgICAgICB0ZXN0OiBmaWx0ZXJlZEZpZWxkcy5tYXAoZnVuY3Rpb24oZmllbGROYW1lKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2RhdHVtLicgKyBmaWVsZE5hbWUgKyAnIT09bnVsbCc7XHJcbiAgICAgICAgfSkuam9pbignICYmICcpXHJcbiAgICAgIH1dIDogW107XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gZmlsdGVyVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xyXG4gICAgdmFyIGZpbHRlciA9IG1vZGVsLmRhdGEoKS5maWx0ZXI7XHJcbiAgICByZXR1cm4gZmlsdGVyID8gW3tcclxuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcclxuICAgICAgICB0ZXN0OiBmaWx0ZXJcclxuICAgIH1dIDogW107XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gZm9ybXVsYVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcclxuICAgIHZhciBjYWxjdWxhdGUgPSBtb2RlbC5kYXRhKCkuY2FsY3VsYXRlO1xyXG4gICAgaWYgKGNhbGN1bGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FsY3VsYXRlLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZvcm11bGEpIHtcclxuICAgICAgdHJhbnNmb3JtLnB1c2godXRpbC5leHRlbmQoe3R5cGU6ICdmb3JtdWxhJ30sIGZvcm11bGEpKTtcclxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcclxuICAgIH0sIFtdKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgbGF5b3V0IHtcclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xyXG4gICAgbGV0IHN1bW1hcml6ZSA9IFtdO1xyXG4gICAgbGV0IGZvcm11bGFzID0gW107XHJcblxyXG4gICAgLy8gVE9ETzogaGFuZGxlIFwiZml0XCIgbW9kZVxyXG4gICAgaWYgKG1vZGVsLmhhcyhYKSAmJiBtb2RlbC5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBGSVhNRSBjaGVjayBpZiB3ZSBuZWVkIHRvIGNhbGwgdHdpY2VcclxuICAgICAgc3VtbWFyaXplLnB1c2goe1xyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKSxcclxuICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgeFNjYWxlID0gbW9kZWwuZmllbGREZWYoWCkuc2NhbGU7XHJcbiAgICAgIGZvcm11bGFzLnB1c2goe1xyXG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcclxuICAgICAgICBmaWVsZDogJ2NlbGxXaWR0aCcsXHJcbiAgICAgICAgLy8gKHhDYXJkaW5hbGl0eSArIG1vZGVsLnBhZGRpbmcoWCkpICogeEJhbmRXaWR0aFxyXG4gICAgICAgIGV4cHI6ICcoJyArIG1vZGVsLmZpZWxkKFgsIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSkgKyAnICsgJyArXHJcbiAgICAgICAgICAgICAgeFNjYWxlLnBhZGRpbmcgKyAnKSAqICcgKyB4U2NhbGUuYmFuZFdpZHRoXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gRklYTUUgY2hlY2sgaWYgd2UgbmVlZCB0byBjYWxsIHR3aWNlXHJcbiAgICAgIHN1bW1hcml6ZS5wdXNoKHtcclxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSksXHJcbiAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCB5U2NhbGUgPSBtb2RlbC5maWVsZERlZihZKS5zY2FsZTtcclxuICAgICAgZm9ybXVsYXMucHVzaCh7XHJcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxyXG4gICAgICAgIGZpZWxkOiAnY2VsbEhlaWdodCcsXHJcbiAgICAgICAgLy8gKHlDYXJkaW5hbGl0eSArIG1vZGVsLnBhZGRpbmcoWSkpICogeUJhbmRXaWR0aFxyXG4gICAgICAgIGV4cHI6ICcoJyArIG1vZGVsLmZpZWxkKFksIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSkgKyAnICsgJyArXHJcbiAgICAgICAgICAgICAgeVNjYWxlLnBhZGRpbmcgKyAnKSAqICcgKyB5U2NhbGUuYmFuZFdpZHRoXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNlbGxQYWRkaW5nID0gbW9kZWwuY29uZmlnKCdjZWxsJykucGFkZGluZztcclxuICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmxheW91dCgpO1xyXG5cclxuICAgIGlmIChtb2RlbC5oYXMoQ09MVU1OKSkge1xyXG4gICAgICBjb25zdCBjZWxsV2lkdGggPSBsYXlvdXQuY2VsbFdpZHRoLmZpZWxkID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdHVtLicgKyBsYXlvdXQuY2VsbFdpZHRoLmZpZWxkIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0LmNlbGxXaWR0aDtcclxuICAgICAgY29uc3QgZGlzdGluY3RDb2wgPSBtb2RlbC5maWVsZChDT0xVTU4sIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XHJcbiAgICAgIHN1bW1hcml6ZS5wdXNoKHtcclxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5maWVsZCxcclxuICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxyXG4gICAgICB9KTtcclxuICAgICAgZm9ybXVsYXMucHVzaCh7XHJcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxyXG4gICAgICAgIGZpZWxkOiAnd2lkdGgnLFxyXG4gICAgICAgIC8vIGNlbGxXaWR0aCArICh8Y29sfCArICh8Y29sfCAtIDEpICogY2VsbFBhZGRpbmcpXHJcbiAgICAgICAgZXhwcjogY2VsbFdpZHRoICsgJyAqICcgKyBkaXN0aW5jdENvbCArICcgKyAnICtcclxuICAgICAgICAgICAgICAnKCcgKyBkaXN0aW5jdENvbCArICcgLSAxKSAqICcgKyBjZWxsUGFkZGluZ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9kZWwuaGFzKFJPVykpIHtcclxuICAgICAgY29uc3QgY2VsbEhlaWdodCA9IGxheW91dC5jZWxsSGVpZ2h0LmZpZWxkID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdHVtLicgKyBsYXlvdXQuY2VsbEhlaWdodC5maWVsZCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dC5jZWxsSGVpZ2h0O1xyXG4gICAgICBjb25zdCBkaXN0aW5jdFJvdyA9IG1vZGVsLmZpZWxkKFJPVywge2RhdHVtOiB0cnVlLCBwcmVmbjogJ2Rpc3RpbmN0Xyd9KTtcclxuICAgICAgc3VtbWFyaXplLnB1c2goe1xyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZERlZihST1cpLmZpZWxkLFxyXG4gICAgICAgIG9wczogWydkaXN0aW5jdCddXHJcbiAgICAgIH0pO1xyXG4gICAgICBmb3JtdWxhcy5wdXNoKHtcclxuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXHJcbiAgICAgICAgZmllbGQ6ICdoZWlnaHQnLFxyXG4gICAgICAgIC8vIGNlbGxIZWlnaHQgKyAofHJvd3wgKyAofHJvd3wgLSAxKSAqIGNlbGxQYWRkaW5nKVxyXG4gICAgICAgIGV4cHI6IGNlbGxIZWlnaHQgKyAnICogJyArIGRpc3RpbmN0Um93ICsgJyArICcgK1xyXG4gICAgICAgICAgICAgICcoJyArIGRpc3RpbmN0Um93ICsgJyAtIDEpICogJyArIGNlbGxQYWRkaW5nXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdW1tYXJpemUubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IExBWU9VVCxcclxuICAgICAgICBzb3VyY2U6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICAgIHRyYW5zZm9ybTogW3tcclxuICAgICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgc3VtbWFyaXplOiBzdW1tYXJpemVcclxuICAgICAgICAgIH1dLmNvbmNhdChmb3JtdWxhcylcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBzdW1tYXJ5IHtcclxuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCk6VmdEYXRhIHtcclxuICAgIC8qIGRpY3Qgc2V0IGZvciBkaW1lbnNpb25zICovXHJcbiAgICB2YXIgZGltcyA9IHt9O1xyXG5cclxuICAgIC8qIGRpY3Rpb25hcnkgbWFwcGluZyBmaWVsZCBuYW1lID0+IGRpY3Qgc2V0IG9mIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9ucyAqL1xyXG4gICAgdmFyIG1lYXMgPSB7fTtcclxuXHJcbiAgICB2YXIgaGFzQWdncmVnYXRlID0gZmFsc2U7XHJcblxyXG4gICAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XHJcbiAgICAgICAgaGFzQWdncmVnYXRlID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnKSB7XHJcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XHJcbiAgICAgICAgICBtZWFzWycqJ10uY291bnQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXSA9IG1lYXNbZmllbGREZWYuZmllbGRdIHx8IHt9O1xyXG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bZmllbGREZWYuYWdncmVnYXRlXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcclxuICAgICAgICAgIC8vIFRPRE8oIzY5NCkgb25seSBhZGQgZGltZW5zaW9uIGZvciB0aGUgcmVxdWlyZWQgb25lcy5cclxuICAgICAgICAgIGRpbXNbbW9kZWwuZmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ19zdGFydCd9KV0gPSBtb2RlbC5maWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pO1xyXG4gICAgICAgICAgZGltc1ttb2RlbC5maWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnX21pZCd9KV0gPSBtb2RlbC5maWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnX21pZCd9KTtcclxuICAgICAgICAgIGRpbXNbbW9kZWwuZmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ19lbmQnfSldID0gbW9kZWwuZmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ19lbmQnfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRpbXNbZmllbGREZWYuZmllbGRdID0gbW9kZWwuZmllbGQoY2hhbm5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGdyb3VwYnkgPSB1dGlsLnZhbHMoZGltcyk7XHJcblxyXG4gICAgLy8gc2hvcnQtZm9ybWF0IHN1bW1hcml6ZSBvYmplY3QgZm9yIFZlZ2EncyBhZ2dyZWdhdGUgdHJhbnNmb3JtXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL3dpa2kvRGF0YS1UcmFuc2Zvcm1zIy1hZ2dyZWdhdGVcclxuICAgIHZhciBzdW1tYXJpemUgPSB1dGlsLnJlZHVjZShtZWFzLCBmdW5jdGlvbihzdW1tYXJpemUsIGZuRGljdFNldCwgZmllbGQpIHtcclxuICAgICAgc3VtbWFyaXplW2ZpZWxkXSA9IHV0aWwua2V5cyhmbkRpY3RTZXQpO1xyXG4gICAgICByZXR1cm4gc3VtbWFyaXplO1xyXG4gICAgfSwge30pO1xyXG5cclxuICAgIGlmIChoYXNBZ2dyZWdhdGUpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBTVU1NQVJZLFxyXG4gICAgICAgIHNvdXJjZTogU09VUkNFLFxyXG4gICAgICAgIHRyYW5zZm9ybTogW3tcclxuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgZ3JvdXBieTogZ3JvdXBieSxcclxuICAgICAgICAgIHN1bW1hcml6ZTogc3VtbWFyaXplXHJcbiAgICAgICAgfV1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIHN0YWNrIHtcclxuICAvKipcclxuICAgKiBBZGQgc3RhY2tlZCBkYXRhIHNvdXJjZSwgZm9yIGZlZWRpbmcgdGhlIHNoYXJlZCBzY2FsZS5cclxuICAgKi9cclxuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCwgc3RhY2tQcm9wczogU3RhY2tQcm9wZXJ0aWVzKTpWZ0RhdGEge1xyXG4gICAgdmFyIGdyb3VwYnlDaGFubmVsID0gc3RhY2tQcm9wcy5ncm91cGJ5Q2hhbm5lbDtcclxuICAgIHZhciBmaWVsZENoYW5uZWwgPSBzdGFja1Byb3BzLmZpZWxkQ2hhbm5lbDtcclxuICAgIHZhciBmYWNldEZpZWxkcyA9IChtb2RlbC5oYXMoQ09MVU1OKSA/IFttb2RlbC5maWVsZChDT0xVTU4pXSA6IFtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCgobW9kZWwuaGFzKFJPVykgPyBbbW9kZWwuZmllbGQoUk9XKV0gOiBbXSkpO1xyXG5cclxuICAgIHZhciBzdGFja2VkOlZnRGF0YSA9IHtcclxuICAgICAgbmFtZTogU1RBQ0tFRCxcclxuICAgICAgc291cmNlOiBtb2RlbC5kYXRhVGFibGUoKSxcclxuICAgICAgdHJhbnNmb3JtOiBbe1xyXG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxyXG4gICAgICAgIC8vIGdyb3VwIGJ5IGNoYW5uZWwgYW5kIG90aGVyIGZhY2V0c1xyXG4gICAgICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChncm91cGJ5Q2hhbm5lbCldLmNvbmNhdChmYWNldEZpZWxkcyksXHJcbiAgICAgICAgc3VtbWFyaXplOiBbe29wczogWydzdW0nXSwgZmllbGQ6IG1vZGVsLmZpZWxkKGZpZWxkQ2hhbm5lbCl9XVxyXG4gICAgICB9XVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZmFjZXRGaWVsZHMgJiYgZmFjZXRGaWVsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBzdGFja2VkLnRyYW5zZm9ybS5wdXNoKHsgLy9jYWxjdWxhdGUgbWF4IGZvciBlYWNoIGZhY2V0XHJcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgZ3JvdXBieTogZmFjZXRGaWVsZHMsXHJcbiAgICAgICAgc3VtbWFyaXplOiBbe1xyXG4gICAgICAgICAgb3BzOiBbJ21heCddLFxyXG4gICAgICAgICAgLy8gd2Ugd2FudCBtYXggb2Ygc3VtIGZyb20gYWJvdmUgdHJhbnNmb3JtXHJcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoZmllbGRDaGFubmVsLCB7cHJlZm46ICdzdW1fJ30pXHJcbiAgICAgICAgfV1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhY2tlZDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGF0YVRhYmxlLCBtb2RlbDogTW9kZWwpIHtcclxuICBtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKF8sIGNoYW5uZWwpIHtcclxuICAgIGlmIChtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS50eXBlID09PSAnbG9nJykge1xyXG4gICAgICBkYXRhVGFibGUudHJhbnNmb3JtLnB1c2goe1xyXG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxyXG4gICAgICAgIHRlc3Q6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtkYXR1bTogdHJ1ZX0pICsgJyA+IDAnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XHJcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFRFWFQsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xyXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcclxuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XHJcblxyXG5pbXBvcnQge2NvbXBpbGVBeGlzfSBmcm9tICcuL2F4aXMnO1xyXG5pbXBvcnQge2NvbXBpbGVTY2FsZXN9IGZyb20gJy4vc2NhbGUnO1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBtaXhpbnMgdGhhdCBjb250YWlucyBtYXJrcywgc2NhbGVzLCBhbmQgYXhlcyBmb3IgdGhlIHJvb3RHcm91cFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZhY2V0TWl4aW5zKG1vZGVsOiBNb2RlbCwgbWFya3MpIHtcclxuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcclxuXHJcbiAgY29uc3QgY2VsbFdpZHRoOiBhbnkgPSAhbW9kZWwuaGFzKENPTFVNTikgP1xyXG4gICAgICB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319IDogICAgIC8vIGNlbGxXaWR0aCA9IHdpZHRoIC0tIGp1c3QgdXNlIGdyb3VwJ3NcclxuICAgIGxheW91dC5jZWxsV2lkdGguZmllbGQgP1xyXG4gICAgICB7c2NhbGU6ICdjb2x1bW4nLCBiYW5kOiB0cnVlfSA6IC8vIGJhbmRTaXplIG9mIHRoZSBzY2FsZVxyXG4gICAgICB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9OyAgICAgIC8vIHN0YXRpYyB2YWx1ZVxyXG5cclxuICBjb25zdCBjZWxsSGVpZ2h0OiBhbnkgPSAhbW9kZWwuaGFzKFJPVykgP1xyXG4gICAgICB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSA6ICAvLyBjZWxsSGVpZ2h0ID0gaGVpZ2h0IC0tIGp1c3QgdXNlIGdyb3VwJ3NcclxuICAgIGxheW91dC5jZWxsSGVpZ2h0LmZpZWxkID9cclxuICAgICAge3NjYWxlOiAncm93JywgYmFuZDogdHJ1ZX0gOiAgLy8gYmFuZFNpemUgb2YgdGhlIHNjYWxlXHJcbiAgICAgIHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9OyAgIC8vIHN0YXRpYyB2YWx1ZVxyXG5cclxuICBsZXQgZmFjZXRHcm91cFByb3BlcnRpZXM6IGFueSA9IHtcclxuICAgIHdpZHRoOiBjZWxsV2lkdGgsXHJcbiAgICBoZWlnaHQ6IGNlbGxIZWlnaHRcclxuICB9O1xyXG5cclxuICAvLyBhZGQgY29uZmlncyB0aGF0IGFyZSB0aGUgcmVzdWx0aW5nIGdyb3VwIG1hcmtzIHByb3BlcnRpZXNcclxuICBjb25zdCBjZWxsQ29uZmlnID0gbW9kZWwuY29uZmlnKCdjZWxsJyk7XHJcbiAgWydmaWxsJywgJ2ZpbGxPcGFjaXR5JywgJ3N0cm9rZScsICdzdHJva2VXaWR0aCcsXHJcbiAgICAnc3Ryb2tlT3BhY2l0eScsICdzdHJva2VEYXNoJywgJ3N0cm9rZURhc2hPZmZzZXQnXVxyXG4gICAgLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSBjZWxsQ29uZmlnW3Byb3BlcnR5XTtcclxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBmYWNldEdyb3VwUHJvcGVydGllc1twcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIGxldCByb290TWFya3MgPSBbXSwgcm9vdEF4ZXMgPSBbXSwgZmFjZXRLZXlzID0gW10sIGNlbGxBeGVzID0gW107XHJcbiAgY29uc3QgaGFzUm93ID0gbW9kZWwuaGFzKFJPVyksIGhhc0NvbCA9IG1vZGVsLmhhcyhDT0xVTU4pO1xyXG5cclxuICAvLyBUT0RPKCM5MCk6IGFkZCBwcm9wZXJ0eSB0byBrZWVwIGF4ZXMgaW4gY2VsbHMgZXZlbiBpZiByb3cgaXMgZW5jb2RlZFxyXG4gIGlmIChoYXNSb3cpIHtcclxuICAgIGlmICghbW9kZWwuaXNEaW1lbnNpb24oUk9XKSkge1xyXG4gICAgICAvLyBUT0RPOiBhZGQgZXJyb3IgdG8gbW9kZWwgaW5zdGVhZFxyXG4gICAgICB1dGlsLmVycm9yKCdSb3cgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XHJcbiAgICB9XHJcbiAgICBmYWNldEdyb3VwUHJvcGVydGllcy55ID0ge1xyXG4gICAgICBzY2FsZTogUk9XLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoUk9XKVxyXG4gICAgfTtcclxuXHJcbiAgICBmYWNldEtleXMucHVzaChtb2RlbC5maWVsZChST1cpKTtcclxuICAgIHJvb3RBeGVzLnB1c2goY29tcGlsZUF4aXMoUk9XLCBtb2RlbCkpO1xyXG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xyXG4gICAgICAvLyBJZiBoYXMgWCwgcHJlcGVuZCBhIGdyb3VwIGZvciBzaGFyZWQgeC1heGVzIGluIHRoZSByb290IGdyb3VwJ3MgbWFya3NcclxuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0WEF4ZXNHcm91cChtb2RlbCwgY2VsbFdpZHRoLCBoYXNDb2wpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBhZGQgcHJvcGVydGllcyB0byBtYWtlIHJ1bGUgb3B0aW9uYWxcclxuICAgIHJvb3RNYXJrcy5wdXNoKGdldFJvd1J1bGVzR3JvdXAobW9kZWwsIGNlbGxIZWlnaHQpKTtcclxuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XHJcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7IC8va2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcclxuICAgICAgY2VsbEF4ZXMucHVzaChjb21waWxlQXhpcyhYLCBtb2RlbCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETygjOTApOiBhZGQgcHJvcGVydHkgdG8ga2VlcCBheGVzIGluIGNlbGxzIGV2ZW4gaWYgY29sdW1uIGlzIGVuY29kZWRcclxuICBpZiAoaGFzQ29sKSB7XHJcbiAgICBpZiAoIW1vZGVsLmlzRGltZW5zaW9uKENPTFVNTikpIHtcclxuICAgICAgLy8gVE9ETzogYWRkIGVycm9yIHRvIG1vZGVsIGluc3RlYWRcclxuICAgICAgdXRpbC5lcnJvcignQ29sIGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xyXG4gICAgfVxyXG4gICAgZmFjZXRHcm91cFByb3BlcnRpZXMueCA9IHtcclxuICAgICAgc2NhbGU6IENPTFVNTixcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTilcclxuICAgIH07XHJcblxyXG4gICAgZmFjZXRLZXlzLnB1c2gobW9kZWwuZmllbGQoQ09MVU1OKSk7XHJcbiAgICByb290QXhlcy5wdXNoKGNvbXBpbGVBeGlzKENPTFVNTiwgbW9kZWwpKTtcclxuXHJcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XHJcbiAgICAgIC8vIElmIGhhcyBZLCBwcmVwZW5kIGEgZ3JvdXAgZm9yIHNoYXJlZCB5LWF4ZXMgaW4gdGhlIHJvb3QgZ3JvdXAncyBtYXJrc1xyXG4gICAgICByb290TWFya3MucHVzaChnZXRZQXhlc0dyb3VwKG1vZGVsLCBjZWxsSGVpZ2h0LCBoYXNSb3cpKTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IGFkZCBwcm9wZXJ0aWVzIHRvIG1ha2UgcnVsZSBvcHRpb25hbFxyXG4gICAgcm9vdE1hcmtzLnB1c2goZ2V0Q29sdW1uUnVsZXNHcm91cChtb2RlbCwgY2VsbFdpZHRoKSk7XHJcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIGNvbHVtblxyXG4gICAgaWYgKG1vZGVsLmhhcyhZKSkgeyAvL2tlZXAgeSBheGlzIGluIHRoZSBjZWxsXHJcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWSwgbW9kZWwpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxldCBmYWNldEdyb3VwOiBhbnkgPSB7XHJcbiAgICBuYW1lOiAnY2VsbCcsIC8vIEZJWE1FIG1vZGVsLm5hbWUoKSArIGNlbGxcclxuICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICBmcm9tOiB7XHJcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogZmFjZXRLZXlzfV1cclxuICAgIH0sXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHVwZGF0ZTogZmFjZXRHcm91cFByb3BlcnRpZXNcclxuICAgIH0sXHJcbiAgICBtYXJrczogbWFya3NcclxuICB9O1xyXG4gIGlmIChjZWxsQXhlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBmYWNldEdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcclxuICB9XHJcbiAgcm9vdE1hcmtzLnB1c2goZmFjZXRHcm91cCk7XHJcblxyXG4gIGNvbnN0IHNjYWxlTmFtZXMgPSBtb2RlbC5tYXAoZnVuY3Rpb24oXywgY2hhbm5lbDogQ2hhbm5lbCl7XHJcbiAgICByZXR1cm4gY2hhbm5lbDsgLy8gVE9ETyBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbClcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1hcmtzOiByb290TWFya3MsXHJcbiAgICBheGVzOiByb290QXhlcyxcclxuICAgIC8vIGFzc3VtaW5nIGVxdWFsIGNlbGxXaWR0aCBoZXJlXHJcbiAgICBzY2FsZXM6IGNvbXBpbGVTY2FsZXMoc2NhbGVOYW1lcywgbW9kZWwpXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WEF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCwgaGFzQ29sOiBib29sZWFuKSB7XHJcbiAgbGV0IHhBeGVzR3JvdXA6IGFueSA9IHsgLy8gVE9ETzogVmdNYXJrc1xyXG4gICAgbmFtZTogJ3gtYXhlcycsXHJcbiAgICB0eXBlOiAnZ3JvdXAnLFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICB1cGRhdGU6IHtcclxuICAgICAgICB3aWR0aDogY2VsbFdpZHRoLFxyXG4gICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0sXHJcbiAgICAgICAgeDogaGFzQ29sID8ge3NjYWxlOiBDT0xVTU4sIGZpZWxkOiBtb2RlbC5maWVsZChDT0xVTU4pfSA6IHt2YWx1ZTogMH0sXHJcbiAgICAgICAgeToge3ZhbHVlOiAtIG1vZGVsLmNvbmZpZygnY2VsbCcpLnBhZGRpbmcgLyAyfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXhlczogW2NvbXBpbGVBeGlzKFgsIG1vZGVsKV1cclxuICB9O1xyXG4gIGlmIChoYXNDb2wpIHtcclxuICAgIC8vIEZJWE1FIGZhY2V0IGlzIHRvbyBleHBlbnNpdmUgaGVyZSAtIHdlIG9ubHkgbmVlZCB0byBrbm93IHVuaXF1ZSBjb2x1bW5zXHJcbiAgICB4QXhlc0dyb3VwLmZyb20gPSB7XHJcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICB0cmFuc2Zvcm06IHt0eXBlOiAnZmFjZXQnLCBncm91cGJ5OiBbbW9kZWwuZmllbGQoQ09MVU1OKV19XHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4geEF4ZXNHcm91cDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQsIGhhc1JvdzogYm9vbGVhbikge1xyXG4gIGxldCB5QXhlc0dyb3VwOiBhbnkgPSB7IC8vIFRPRE86IFZnTWFya3NcclxuICAgIG5hbWU6ICd5LWF4ZXMnLFxyXG4gICAgdHlwZTogJ2dyb3VwJyxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgdXBkYXRlOiB7XHJcbiAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXHJcbiAgICAgICAgaGVpZ2h0OiBjZWxsSGVpZ2h0LFxyXG4gICAgICAgIHg6IHt2YWx1ZTogLSBtb2RlbC5jb25maWcoJ2NlbGwnKS5wYWRkaW5nIC8gMn0sXHJcbiAgICAgICAgeTogaGFzUm93ID8ge3NjYWxlOiBST1csIGZpZWxkOiBtb2RlbC5maWVsZChST1cpfSA6IHt2YWx1ZTogMH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGF4ZXM6IFtjb21waWxlQXhpcyhZLCBtb2RlbCldXHJcbiAgfTtcclxuXHJcbiAgaWYgKGhhc1Jvdykge1xyXG4gICAgLy8gRklYTUUgZmFjZXQgaXMgdG9vIGV4cGVuc2l2ZSBoZXJlIC0gd2Ugb25seSBuZWVkIHRvIGtub3cgdW5pcXVlIHJvd3NcclxuICAgIHlBeGVzR3JvdXAuZnJvbSA9IHtcclxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXHJcbiAgICAgIHRyYW5zZm9ybToge3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IFttb2RlbC5maWVsZChST1cpXX1cclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiB5QXhlc0dyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSb3dSdWxlc0dyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbEhlaWdodCk6IGFueSB7IC8vIFRPRE86IFZnTWFya3NcclxuICBjb25zdCByb3dSdWxlc09uVG9wID0gIW1vZGVsLmhhcyhYKSB8fCBtb2RlbC5maWVsZERlZihYKS5heGlzLm9yaWVudCAhPT0gJ3RvcCc7XHJcbiAgY29uc3Qgb2Zmc2V0ID0gbW9kZWwuY29uZmlnKCdjZWxsJykucGFkZGluZyAvIDIgLSAxO1xyXG4gIGNvbnN0IHJvd1J1bGVzID0ge1xyXG4gICAgbmFtZTogJ3Jvdy1ydWxlcycsXHJcbiAgICB0eXBlOiAncnVsZScsXHJcbiAgICBmcm9tOiB7XHJcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogW21vZGVsLmZpZWxkKFJPVyldfV1cclxuICAgIH0sXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIHk6IHtcclxuICAgICAgICAgIHNjYWxlOiAncm93JyxcclxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpLFxyXG4gICAgICAgICAgb2Zmc2V0OiAocm93UnVsZXNPblRvcCA/IC0xIDogMSkgKiBvZmZzZXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIHg6IHt2YWx1ZTogMCwgb2Zmc2V0OiAtbW9kZWwuY29uZmlnKCdjZWxsJykuZ3JpZE9mZnNldH0sXHJcbiAgICAgICAgeDI6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfSwgb2Zmc2V0OiBtb2RlbC5jb25maWcoJ2NlbGwnKS5ncmlkT2Zmc2V0fSxcclxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygnY2VsbCcpLmdyaWRDb2xvciB9LFxyXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygnY2VsbCcpLmdyaWRPcGFjaXR5IH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGlmIChyb3dSdWxlc09uVG9wKSB7IC8vIG9uIHRvcCAtIG5vIG5lZWQgdG8gYWRkIG9mZnNldFxyXG4gICAgcmV0dXJuIHJvd1J1bGVzO1xyXG4gIH0gLy8gb3RoZXJ3aXNlLCBuZWVkIHRvIG9mZnNldCBhbGwgcnVsZXMgYnkgY2VsbEhlaWdodFxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAncm93LXJ1bGVzLWdyb3VwJyxcclxuICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIC8vIGFkZCBvZmZzZXQgdG8gYXZvaWQgY2xhc2hpbmcgd2l0aCBheGlzXHJcbiAgICAgICAgeTogY2VsbEhlaWdodC52YWx1ZSA/XHJcbiAgICAgICAgICAvLyBJZiBjZWxsSGVpZ2h0IGNvbnRhaW5zIHZhbHVlLCBqdXN0IHVzZSBpdC5cclxuICAgICAgICAgIGNlbGxIZWlnaHQgOlxyXG4gICAgICAgICAgLy8gT3RoZXJ3aXNlLCBuZWVkIHRvIGdldCBpdCBmcm9tIGxheW91dCBkYXRhIGluIHRoZSByb290IGdyb3VwXHJcbiAgICAgICAgICB7ZmllbGQ6IHtwYXJlbnQ6ICdjZWxsSGVpZ2h0J319LFxyXG5cclxuICAgICAgICAvLyBpbmNsdWRlIHdpZHRoIHNvIGl0IGNhbiBiZSByZWZlcnJlZCBpbnNpZGUgcm93LXJ1bGVzXHJcbiAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hcmtzOiBbcm93UnVsZXNdXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29sdW1uUnVsZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCk6IGFueSB7IC8vIFRPRE86IFZnTWFya3NcclxuICBjb25zdCBjb2xSdWxlc09uTGVmdCA9ICFtb2RlbC5oYXMoWSkgfHwgbW9kZWwuZmllbGREZWYoWSkuYXhpcy5vcmllbnQgPT09ICdyaWdodCc7XHJcbiAgY29uc3Qgb2Zmc2V0ID0gbW9kZWwuY29uZmlnKCdjZWxsJykucGFkZGluZyAvIDIgLSAxO1xyXG4gIGNvbnN0IGNvbHVtblJ1bGVzID0ge1xyXG4gICAgbmFtZTogJ2NvbHVtbi1ydWxlcycsXHJcbiAgICB0eXBlOiAncnVsZScsXHJcbiAgICBmcm9tOiB7XHJcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogW21vZGVsLmZpZWxkKENPTFVNTildfV1cclxuICAgIH0sXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIHg6IHtcclxuICAgICAgICAgIHNjYWxlOiAnY29sdW1uJyxcclxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xVTU4pLFxyXG4gICAgICAgICAgb2Zmc2V0OiAoY29sUnVsZXNPbkxlZnQgPyAtMSA6IDEpICogb2Zmc2V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICB5OiB7dmFsdWU6IDAsIG9mZnNldDogLW1vZGVsLmNvbmZpZygnY2VsbCcpLmdyaWRPZmZzZXR9LFxyXG4gICAgICAgIHkyOiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9LCBvZmZzZXQ6IG1vZGVsLmNvbmZpZygnY2VsbCcpLmdyaWRPZmZzZXR9LFxyXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogbW9kZWwuY29uZmlnKCdjZWxsJykuZ3JpZENvbG9yIH0sXHJcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogeyB2YWx1ZTogbW9kZWwuY29uZmlnKCdjZWxsJykuZ3JpZE9wYWNpdHkgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaWYgKGNvbFJ1bGVzT25MZWZ0KSB7IC8vIG9uIGxlZnQsIG5vIG5lZWQgdG8gYWRkIGdsb2JhbCBvZmZzZXRcclxuICAgIHJldHVybiBjb2x1bW5SdWxlcztcclxuICB9IC8vIG90aGVyd2lzZSwgbmVlZCB0byBvZmZzZXQgYWxsIHJ1bGVzIGJ5IGNlbGxXaWR0aFxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnY29sdW1uLXJ1bGVzLWdyb3VwJyxcclxuICAgIHR5cGU6ICdncm91cCcsXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgIC8vIEFkZCBvZmZzZXQgdG8gYXZvaWQgY2xhc2hpbmcgd2l0aCBheGlzXHJcbiAgICAgICAgeDogY2VsbFdpZHRoLnZhbHVlID9cclxuICAgICAgICAgICAvLyBJZiBjZWxsV2lkdGggY29udGFpbnMgdmFsdWUsIGp1c3QgdXNlIGl0LlxyXG4gICAgICAgICAgIGNlbGxXaWR0aCA6XHJcbiAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBuZWVkIHRvIGdldCBpdCBmcm9tIGxheW91dCBkYXRhIGluIHRoZSByb290IGdyb3VwXHJcbiAgICAgICAgICAge2ZpZWxkOiB7cGFyZW50OiAnY2VsbFdpZHRoJ319LFxyXG5cclxuICAgICAgICAvLyBpbmNsdWRlIGhlaWdodCBzbyBpdCBjYW4gYmUgcmVmZXJyZWQgaW5zaWRlIGNvbHVtbi1ydWxlc1xyXG4gICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1hcmtzOiBbY29sdW1uUnVsZXNdXHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0ICogYXMgdGltZSBmcm9tICcuL3RpbWUnO1xyXG5cclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XHJcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFRFWFQsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xyXG5pbXBvcnQge0xBWU9VVH0gZnJvbSAnLi4vZGF0YSc7XHJcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcclxuXHJcbmludGVyZmFjZSBEYXRhUmVmIHtcclxuICBkYXRhPzogc3RyaW5nO1xyXG4gIGZpZWxkPzogc3RyaW5nO1xyXG4gIHZhbHVlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vLyB2YWx1ZSB0aGF0IHdlIGNhbiBwdXQgaW4gc2NhbGUncyBkb21haW4vcmFuZ2UgKGVpdGhlciBhIG51bWJlciwgb3IgYSBkYXRhIHJlZilcclxudHlwZSBMYXlvdXRWYWx1ZSA9IG51bWJlciB8IERhdGFSZWY7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUxheW91dChtb2RlbDogTW9kZWwpOiB7W2xheW91dFByb3A6IHN0cmluZ106IExheW91dFZhbHVlfSB7XHJcbiAgY29uc3QgY2VsbFdpZHRoID0gZ2V0Q2VsbFdpZHRoKG1vZGVsKTtcclxuICBjb25zdCBjZWxsSGVpZ2h0ID0gZ2V0Q2VsbEhlaWdodChtb2RlbCk7XHJcbiAgcmV0dXJuIHtcclxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHdob2xlIGNlbGxcclxuICAgIGNlbGxXaWR0aDogY2VsbFdpZHRoLFxyXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcclxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNoYXJ0XHJcbiAgICB3aWR0aDogZ2V0V2lkdGgobW9kZWwsIGNlbGxXaWR0aCksXHJcbiAgICBoZWlnaHQ6IGdldEhlaWdodChtb2RlbCwgY2VsbEhlaWdodClcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsV2lkdGgobW9kZWw6IE1vZGVsKTogTGF5b3V0VmFsdWUge1xyXG4gIGlmIChtb2RlbC5oYXMoWCkpIHtcclxuICAgIGlmIChtb2RlbC5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxyXG4gICAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdjZWxsV2lkdGgnfTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2RlbC5jb25maWcoJ2NlbGwnKS53aWR0aDtcclxuICB9XHJcbiAgaWYgKG1vZGVsLm1hcmt0eXBlKCkgPT09IFRFWFQpIHtcclxuICAgIHJldHVybiBtb2RlbC5jb25maWcoJ3RleHRDZWxsV2lkdGgnKTtcclxuICB9XHJcbiAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V2lkdGgobW9kZWw6IE1vZGVsLCBjZWxsV2lkdGg6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xyXG4gIGlmIChtb2RlbC5oYXMoQ09MVU1OKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxyXG4gICAgcmV0dXJuIHtkYXRhOiBMQVlPVVQsIGZpZWxkOiAnd2lkdGgnfTtcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxXaWR0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEhlaWdodChtb2RlbDogTW9kZWwpOiBMYXlvdXRWYWx1ZSB7XHJcbiAgaWYgKG1vZGVsLmhhcyhZKSkge1xyXG4gICAgaWYgKG1vZGVsLmlzT3JkaW5hbFNjYWxlKFkpKSB7IC8vIGNhbGN1bGF0ZSBpbiBkYXRhXHJcbiAgICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ2NlbGxIZWlnaHQnfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBtb2RlbC5jb25maWcoJ2NlbGwnKS5oZWlnaHQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEhlaWdodChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQ6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xyXG4gIGlmIChtb2RlbC5oYXMoUk9XKSkge1xyXG4gICAgcmV0dXJuIHtkYXRhOiBMQVlPVVQsIGZpZWxkOiAnaGVpZ2h0J307XHJcbiAgfVxyXG4gIHJldHVybiBjZWxsSGVpZ2h0O1xyXG59XHJcbiIsImltcG9ydCB7ZXh0ZW5kLCBrZXlzfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHtDT0xPUiwgU0laRSwgU0hBUEUsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xyXG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0ICogYXMgdGltZSBmcm9tICcuL3RpbWUnO1xyXG5pbXBvcnQge1RFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTGVnZW5kcyhtb2RlbDogTW9kZWwpIHtcclxuICB2YXIgZGVmcyA9IFtdO1xyXG5cclxuICBpZiAobW9kZWwuaGFzKENPTE9SKSAmJiBtb2RlbC5maWVsZERlZihDT0xPUikubGVnZW5kKSB7XHJcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgQ09MT1IsIHtcclxuICAgICAgZmlsbDogQ09MT1JcclxuICAgICAgLy8gVE9ETzogY29uc2lkZXIgaWYgdGhpcyBzaG91bGQgYmUgc3Ryb2tlIGZvciBsaW5lXHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICBpZiAobW9kZWwuaGFzKFNJWkUpICYmIG1vZGVsLmZpZWxkRGVmKFNJWkUpLmxlZ2VuZCkge1xyXG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIFNJWkUsIHtcclxuICAgICAgc2l6ZTogU0laRVxyXG4gICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG1vZGVsLmhhcyhTSEFQRSkgJiYgbW9kZWwuZmllbGREZWYoU0hBUEUpLmxlZ2VuZCkge1xyXG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIFNIQVBFLCB7XHJcbiAgICAgIHNoYXBlOiBTSEFQRVxyXG4gICAgfSkpO1xyXG4gIH1cclxuICByZXR1cm4gZGVmcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVMZWdlbmQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWYpIHtcclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzU4NDJcclxuICBjb25zdCBsZWdlbmQ6YW55ID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkubGVnZW5kO1xyXG5cclxuICAvLyAxLjEgQWRkIHByb3BlcnRpZXMgd2l0aCBzcGVjaWFsIHJ1bGVzXHJcbiAgZGVmLnRpdGxlID0gdGl0bGUobW9kZWwsIGNoYW5uZWwpO1xyXG5cclxuICAvLyAxLjIgQWRkIHByb3BlcnRpZXMgd2l0aG91dCBydWxlc1xyXG4gIFsnb3JpZW50JywgJ2Zvcm1hdCcsICd2YWx1ZXMnXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XHJcbiAgICBsZXQgdmFsdWUgPSBsZWdlbmRbcHJvcGVydHldO1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZGVmW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xyXG4gIGNvbnN0IHByb3BzID0gKHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyAmJiBsZWdlbmQucHJvcGVydGllcykgfHwge307XHJcbiAgWyd0aXRsZScsICdsYWJlbHMnLCAnc3ltYm9scycsICdsZWdlbmQnXS5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBwcm9wZXJ0aWVzW2dyb3VwXSA/XHJcbiAgICAgIHByb3BlcnRpZXNbZ3JvdXBdKG1vZGVsLCBjaGFubmVsLCBwcm9wc1tncm91cF0pIDogLy8gYXBwbHkgcnVsZVxyXG4gICAgICBwcm9wc1tncm91cF07IC8vIG5vIHJ1bGUgLS0ganVzdCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fTtcclxuICAgICAgZGVmLnByb3BlcnRpZXNbZ3JvdXBdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBkZWY7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzU4NDJcclxuICBjb25zdCBsZWdlbmQ6IGFueSA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmxlZ2VuZDtcclxuXHJcbiAgaWYgKHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyAmJiBsZWdlbmQudGl0bGUpIHtcclxuICAgIHJldHVybiBsZWdlbmQudGl0bGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbW9kZWwuZmllbGRUaXRsZShjaGFubmVsKTtcclxufVxyXG5cclxubmFtZXNwYWNlIHByb3BlcnRpZXMge1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzcGVjKSB7XHJcbiAgICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuICAgIHZhciB0aW1lVW5pdCA9IGZpZWxkRGVmLnRpbWVVbml0O1xyXG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIHRpbWVVbml0ICYmIHRpbWUubGFiZWxUZW1wbGF0ZSh0aW1lVW5pdCkpIHtcclxuICAgICAgcmV0dXJuIGV4dGVuZCh7XHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgdGVtcGxhdGU6ICd7e2RhdHVtLmRhdGEgfCAnICsgdGltZS5sYWJlbFRlbXBsYXRlKHRpbWVVbml0KSArICd9fSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHNwZWMgfHwge30pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNwZWM7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gc3ltYm9scyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNwZWMpIHtcclxuICAgIGxldCBzeW1ib2xzOmFueSA9IHt9O1xyXG4gICAgbGV0IG1hcmt0eXBlID0gbW9kZWwubWFya3R5cGUoKTtcclxuXHJcbiAgICBzd2l0Y2ggKG1hcmt0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Jhcic6XHJcbiAgICAgIGNhc2UgJ3RpY2snOlxyXG4gICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XHJcbiAgICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogJ3NxdWFyZSd9O1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnY2lyY2xlJzpcclxuICAgICAgY2FzZSAnc3F1YXJlJzpcclxuICAgICAgICBzeW1ib2xzLnNoYXBlID0ge3ZhbHVlOiBtYXJrdHlwZX07XHJcbiAgICAgICAgLyogZmFsbCB0aHJvdWdoICovXHJcbiAgICAgIGNhc2UgJ3BvaW50JzpcclxuICAgICAgICAvLyBmaWxsIG9yIHN0cm9rZVxyXG4gICAgICAgIGlmIChtb2RlbC5jb25maWcoJ21hcmtzJykuZmlsbGVkKSB7XHJcbiAgICAgICAgICBpZiAobW9kZWwuaGFzKENPTE9SKSAmJiBjaGFubmVsID09PSBDT0xPUikge1xyXG4gICAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKG1vZGVsLmhhcyhDT0xPUikgJiYgY2hhbm5lbCA9PT0gQ09MT1IpIHtcclxuICAgICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc3ltYm9scy5maWxsID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcclxuICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IG1vZGVsLmNvbmZpZygnbWFya3MnKS5zdHJva2VXaWR0aH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbGluZSc6XHJcbiAgICAgIGNhc2UgJ2FyZWEnOlxyXG4gICAgICAgIC8vIFRPRE8gdXNlIHNoYXBlIGhlcmUgYWZ0ZXIgaW1wbGVtZW50aW5nICM1MDhcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgb3BhY2l0eSA9IG1vZGVsLmNvbmZpZygnbWFya3MnKS5vcGFjaXR5O1xyXG4gICAgaWYgKG9wYWNpdHkpIHtcclxuICAgICAgc3ltYm9scy5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcclxuICAgIH1cclxuXHJcbiAgICBzeW1ib2xzID0gZXh0ZW5kKHN5bWJvbHMsIHNwZWMgfHwge30pO1xyXG5cclxuICAgIHJldHVybiBrZXlzKHN5bWJvbHMpLmxlbmd0aCA+IDAgPyBzeW1ib2xzIDogdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgQ09MT1IsIFRFWFQsIFNJWkUsIFNIQVBFLCBERVRBSUwsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xyXG5pbXBvcnQge0FSRUEsIEJBUiwgTElORSwgUE9JTlQsIFRFWFQgYXMgVEVYVE1BUktTLCBUSUNLLCBDSVJDTEUsIFNRVUFSRX0gZnJvbSAnLi4vbWFya3R5cGUnO1xyXG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XHJcbmltcG9ydCB7aW1wdXRlVHJhbnNmb3JtLCBzdGFja1RyYW5zZm9ybX0gZnJvbSAnLi9zdGFjayc7XHJcblxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvYmxvYi9tYXN0ZXIvZG9jL3NwZWMubWQjMTEtYW1iaWVudC1kZWNsYXJhdGlvbnNcclxuZGVjbGFyZSB2YXIgZXhwb3J0cztcclxuXHJcbi8qIG1hcHBpbmcgZnJvbSB2ZWdhLWxpdGUncyBtYXJrIHR5cGVzIHRvIHZlZ2EncyBtYXJrIHR5cGVzICovXHJcbmNvbnN0IE1BUktUWVBFU19NQVAgPSB7XHJcbiAgYmFyOiAncmVjdCcsXHJcbiAgdGljazogJ3JlY3QnLFxyXG4gIHBvaW50OiAnc3ltYm9sJyxcclxuICBsaW5lOiAnbGluZScsXHJcbiAgYXJlYTogJ2FyZWEnLFxyXG4gIHRleHQ6ICd0ZXh0JyxcclxuICBjaXJjbGU6ICdzeW1ib2wnLFxyXG4gIHNxdWFyZTogJ3N5bWJvbCdcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFya3MobW9kZWw6IE1vZGVsKTogYW55W10ge1xyXG4gIGNvbnN0IG1hcmt0eXBlID0gbW9kZWwubWFya3R5cGUoKTtcclxuICBpZiAobWFya3R5cGUgPT09IExJTkUgfHwgbWFya3R5cGUgPT09IEFSRUEpIHtcclxuICAgIC8vIEZvciBMaW5lIGFuZCBBcmVhLCB3ZSBzb3J0IHZhbHVlcyBiYXNlZCBvbiBkaW1lbnNpb24gYnkgZGVmYXVsdFxyXG4gICAgLy8gRm9yIGxpbmUsIGEgc3BlY2lhbCBjb25maWcgXCJzb3J0TGluZUJ5XCIgaXMgYWxsb3dlZFxyXG4gICAgbGV0IHNvcnRCeSA9IG1hcmt0eXBlID09PSBMSU5FID8gbW9kZWwuY29uZmlnKCdzb3J0TGluZUJ5JykgOiB1bmRlZmluZWQ7XHJcbiAgICBpZiAoIXNvcnRCeSkge1xyXG4gICAgICBjb25zdCBzb3J0RmllbGQgPSAobW9kZWwuaXNNZWFzdXJlKFgpICYmIG1vZGVsLmlzRGltZW5zaW9uKFkpKSA/IFkgOiBYO1xyXG4gICAgICBzb3J0QnkgPSAnLScgKyBtb2RlbC5maWVsZChzb3J0RmllbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXRoTWFya3M6IGFueSA9IHtcclxuICAgICAgdHlwZTogTUFSS1RZUEVTX01BUFttYXJrdHlwZV0sXHJcbiAgICAgIGZyb206IHtcclxuICAgICAgICAvLyBmcm9tLmRhdGEgbWlnaHQgYmUgYWRkZWQgbGF0ZXIgZm9yIG5vbi1mYWNldCwgc2luZ2xlIGdyb3VwIGxpbmUvYXJlYVxyXG4gICAgICAgIHRyYW5zZm9ybTogW3t0eXBlOiAnc29ydCcsIGJ5OiBzb3J0Qnl9XVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgdXBkYXRlOiBwcm9wZXJ0aWVzW21hcmt0eXBlXShtb2RlbClcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBGSVhNRSBpcyB0aGVyZSBhIGNhc2Ugd2hlcmUgYXJlYSByZXF1aXJlcyBpbXB1dGUgd2l0aG91dCBzdGFja2luZz9cclxuXHJcbiAgICBjb25zdCBkZXRhaWxzID0gZGV0YWlsRmllbGRzKG1vZGVsKTtcclxuICAgIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXHJcbiAgICAgIGNvbnN0IGZhY2V0VHJhbnNmb3JtID0ge3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGRldGFpbHN9O1xyXG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSBtYXJrdHlwZSA9PT0gQVJFQSAmJiBtb2RlbC5zdGFjaygpID9cclxuICAgICAgICAvLyBGb3Igc3RhY2tlZCBhcmVhLCB3ZSBuZWVkIHRvIGltcHV0ZSBtaXNzaW5nIHR1cGxlcyBhbmQgc3RhY2sgdmFsdWVzXHJcbiAgICAgICAgW2ltcHV0ZVRyYW5zZm9ybShtb2RlbCksIHN0YWNrVHJhbnNmb3JtKG1vZGVsKSwgZmFjZXRUcmFuc2Zvcm1dIDpcclxuICAgICAgICBbZmFjZXRUcmFuc2Zvcm1dO1xyXG5cclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogbWFya3R5cGUgICsgJy1mYWNldCcsXHJcbiAgICAgICAgdHlwZTogJ2dyb3VwJyxcclxuICAgICAgICBmcm9tOiB7XHJcbiAgICAgICAgICAvLyBmcm9tLmRhdGEgbWlnaHQgYmUgYWRkZWQgbGF0ZXIgZm9yIG5vbi1mYWNldCBjaGFydHNcclxuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICB1cGRhdGU6IHtcclxuICAgICAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXHJcbiAgICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1hcmtzOiBbcGF0aE1hcmtzXVxyXG4gICAgICB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbcGF0aE1hcmtzXTtcclxuICAgIH1cclxuICB9IGVsc2UgeyAvLyBvdGhlciBtYXJrIHR5cGVcclxuICAgIGxldCBtYXJrcyA9IFtdOyAvLyBUT0RPOiB2Z01hcmtzXHJcbiAgICBpZiAobWFya3R5cGUgPT09IFRFWFRNQVJLUyAmJiBtb2RlbC5oYXMoQ09MT1IpKSB7XHJcbiAgICAgIC8vIGFkZCBiYWNrZ3JvdW5kIHRvICd0ZXh0JyBtYXJrcyBpZiBoYXMgY29sb3JcclxuICAgICAgbWFya3MucHVzaCh7XHJcbiAgICAgICAgdHlwZTogJ3JlY3QnLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHt1cGRhdGU6IHByb3BlcnRpZXMudGV4dEJhY2tncm91bmQobW9kZWwpfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWFpbkRlZjogYW55ID0ge1xyXG4gICAgICAvLyBUT0RPIGFkZCBuYW1lXHJcbiAgICAgIHR5cGU6IE1BUktUWVBFU19NQVBbbWFya3R5cGVdLFxyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgdXBkYXRlOiBwcm9wZXJ0aWVzW21hcmt0eXBlXShtb2RlbClcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcclxuICAgIGlmIChtYXJrdHlwZSA9PT0gQkFSICYmIHN0YWNrKSB7XHJcbiAgICAgIG1haW5EZWYuZnJvbSA9IHtcclxuICAgICAgICB0cmFuc2Zvcm06IFtzdGFja1RyYW5zZm9ybShtb2RlbCldXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBtYXJrcy5wdXNoKG1haW5EZWYpO1xyXG5cclxuICAgIC8vIGlmIChtb2RlbC5oYXMoTEFCRUwpKSB7XHJcbiAgICAvLyAgIC8vIFRPRE86IGFkZCBsYWJlbCBieSB0eXBlIGhlcmVcclxuICAgIC8vIH1cclxuXHJcbiAgICByZXR1cm4gbWFya3M7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBsaXN0IG9mIGRldGFpbCBmaWVsZHMgKGZvciAnY29sb3InLCAnc2hhcGUnLCBvciAnZGV0YWlsJyBjaGFubmVscylcclxuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxyXG4gKi9cclxuZnVuY3Rpb24gZGV0YWlsRmllbGRzKG1vZGVsOk1vZGVsKTogc3RyaW5nW10ge1xyXG4gIHJldHVybiBbQ09MT1IsIERFVEFJTCwgU0hBUEVdLnJlZHVjZShmdW5jdGlvbihkZXRhaWxzLCBjaGFubmVsKSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKGNoYW5uZWwpICYmICFtb2RlbC5maWVsZERlZihjaGFubmVsKS5hZ2dyZWdhdGUpIHtcclxuICAgICAgZGV0YWlscy5wdXNoKG1vZGVsLmZpZWxkKGNoYW5uZWwpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXRhaWxzO1xyXG4gIH0sIFtdKTtcclxufVxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcclxuZXhwb3J0IGZ1bmN0aW9uIGJhcihtb2RlbDogTW9kZWwpIHtcclxuICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XHJcblxyXG4gIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxyXG4gIHZhciBwOmFueSA9IHt9O1xyXG5cclxuICAvLyB4J3MgYW5kIHdpZHRoXHJcbiAgaWYgKHN0YWNrICYmIFggPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xyXG4gICAgcC54ID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpICsgJ19zdGFydCdcclxuICAgIH07XHJcbiAgICBwLngyID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpICsgJ19lbmQnXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoWCkuYmluKSB7XHJcbiAgICBwLnggPSB7XHJcbiAgICAgIHNjYWxlOiBYLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwge2JpblN1ZmZpeDogJ19zdGFydCd9KSxcclxuICAgICAgb2Zmc2V0OiAxXHJcbiAgICB9O1xyXG4gICAgcC54MiA9IHtcclxuICAgICAgc2NhbGU6IFgsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7YmluU3VmZml4OiAnX2VuZCd9KVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShYKSkge1xyXG4gICAgcC54ID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpXHJcbiAgICB9O1xyXG4gICAgaWYgKCFtb2RlbC5oYXMoWSkgfHwgbW9kZWwuaXNEaW1lbnNpb24oWSkpIHtcclxuICAgICAgcC54MiA9IHt2YWx1ZTogMH07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxyXG4gICAgICAgcC54YyA9IHtcclxuICAgICAgICAgc2NhbGU6IFgsXHJcbiAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKVxyXG4gICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICBwLnggPSB7dmFsdWU6IDAsIG9mZnNldDogbW9kZWwuY29uZmlnKCdzaW5nbGVCYXJPZmZzZXQnKX07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyB3aWR0aFxyXG4gIGlmICghcC54Mikge1xyXG4gICAgaWYgKCFtb2RlbC5oYXMoWCkgfHwgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWCkpIHsgLy8gbm8gWCBvciBYIGlzIG9yZGluYWxcclxuICAgICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xyXG4gICAgICAgIHAud2lkdGggPSB7XHJcbiAgICAgICAgICBzY2FsZTogU0laRSxcclxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRklYTUUgY29uc2lkZXIgdXNpbmcgYmFuZDogdHJ1ZSBoZXJlXHJcbiAgICAgICAgcC53aWR0aCA9IHtcclxuICAgICAgICAgIHZhbHVlOiBtb2RlbC5maWVsZERlZihYKS5zY2FsZS5iYW5kV2lkdGgsXHJcbiAgICAgICAgICBvZmZzZXQ6IC0xXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gWCBpcyBRdWFudCBvciBUaW1lIFNjYWxlXHJcbiAgICAgIHAud2lkdGggPSB7dmFsdWU6IDJ9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8geSdzICYgaGVpZ2h0XHJcbiAgaWYgKHN0YWNrICYmIFkgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xyXG4gICAgcC55ID0ge1xyXG4gICAgICBzY2FsZTogWSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpICsgJ19zdGFydCdcclxuICAgIH07XHJcbiAgICBwLnkyID0ge1xyXG4gICAgICBzY2FsZTogWSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpICsgJ19lbmQnXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoWSkuYmluKSB7XHJcbiAgICBwLnkgPSB7XHJcbiAgICAgIHNjYWxlOiBZLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwge2JpblN1ZmZpeDogJ19zdGFydCd9KVxyXG4gICAgfTtcclxuICAgIHAueTIgPSB7XHJcbiAgICAgIHNjYWxlOiBZLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwge2JpblN1ZmZpeDogJ19lbmQnfSksXHJcbiAgICAgIG9mZnNldDogMVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShZKSkge1xyXG4gICAgcC55ID0ge1xyXG4gICAgICBzY2FsZTogWSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXHJcbiAgICB9O1xyXG4gICAgcC55MiA9IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7IC8vIGlzIG9yZGluYWxcclxuICAgICAgcC55YyA9IHtcclxuICAgICAgICBzY2FsZTogWSxcclxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHAueTIgPSB7XHJcbiAgICAgICAgZmllbGQ6IHtncm91cDogJ2hlaWdodCd9LFxyXG4gICAgICAgIG9mZnNldDogLW1vZGVsLmNvbmZpZygnc2luZ2xlQmFyT2Zmc2V0JylcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9kZWwuaGFzKFNJWkUpKSB7XHJcbiAgICAgIHAuaGVpZ2h0ID0ge1xyXG4gICAgICAgIHNjYWxlOiBTSVpFLFxyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gRklYTUU6IGJhbmQ6dHJ1ZT9cclxuICAgICAgcC5oZWlnaHQgPSB7XHJcbiAgICAgICAgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlLmJhbmRXaWR0aCxcclxuICAgICAgICBvZmZzZXQ6IC0xXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmaWxsXHJcbiAgaWYgKG1vZGVsLmhhcyhDT0xPUikpIHtcclxuICAgIHAuZmlsbCA9IHtcclxuICAgICAgc2NhbGU6IENPTE9SLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwLmZpbGwgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XHJcbiAgfVxyXG5cclxuICAvLyBvcGFjaXR5XHJcbiAgdmFyIG9wYWNpdHkgPSBtb2RlbC5jb25maWcoJ21hcmtzJykub3BhY2l0eTtcclxuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcclxuXHJcbiAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwb2ludChtb2RlbDogTW9kZWwpIHtcclxuICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcclxuICB2YXIgcDphbnkgPSB7fTtcclxuICBjb25zdCBtYXJrc0NvbmZpZyA9IG1vZGVsLmNvbmZpZygnbWFya3MnKTtcclxuXHJcbiAgLy8geFxyXG4gIGlmIChtb2RlbC5oYXMoWCkpIHtcclxuICAgIHAueCA9IHtcclxuICAgICAgc2NhbGU6IFgsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7YmluU3VmZml4OiAnX21pZCd9KVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoWCkpIHtcclxuICAgIHAueCA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoWCkuc2NhbGUuYmFuZFdpZHRoIC8gMn07XHJcbiAgfVxyXG5cclxuICAvLyB5XHJcbiAgaWYgKG1vZGVsLmhhcyhZKSkge1xyXG4gICAgcC55ID0ge1xyXG4gICAgICBzY2FsZTogWSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHtiaW5TdWZmaXg6ICdfbWlkJ30pXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhZKSkge1xyXG4gICAgcC55ID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGggLyAyfTtcclxuICB9XHJcblxyXG4gIC8vIHNpemVcclxuICBpZiAobW9kZWwuaGFzKFNJWkUpKSB7XHJcbiAgICBwLnNpemUgPSB7XHJcbiAgICAgIHNjYWxlOiBTSVpFLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFNJWkUpKSB7XHJcbiAgICBwLnNpemUgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKFNJWkUpLnZhbHVlfTtcclxuICB9XHJcblxyXG4gIC8vIHNoYXBlXHJcbiAgaWYgKG1vZGVsLmhhcyhTSEFQRSkpIHtcclxuICAgIHAuc2hhcGUgPSB7XHJcbiAgICAgIHNjYWxlOiBTSEFQRSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNIQVBFKVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoU0hBUEUpKSB7XHJcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihTSEFQRSkudmFsdWV9O1xyXG4gIH1cclxuXHJcbiAgLy8gZmlsbCBvciBzdHJva2VcclxuICBpZiAobWFya3NDb25maWcuZmlsbGVkKSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xyXG4gICAgICBwLmZpbGwgPSB7XHJcbiAgICAgICAgc2NhbGU6IENPTE9SLFxyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhDT0xPUikpIHtcclxuICAgICAgcC5maWxsID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xyXG4gICAgICBwLnN0cm9rZSA9IHtcclxuICAgICAgICBzY2FsZTogQ09MT1IsXHJcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTE9SKVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmICghbW9kZWwuaGFzKENPTE9SKSkge1xyXG4gICAgICBwLnN0cm9rZSA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlfTtcclxuICAgIH1cclxuICAgIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IG1vZGVsLmNvbmZpZygnbWFya3MnKS5zdHJva2VXaWR0aH07XHJcbiAgfVxyXG5cclxuICAvLyBvcGFjaXR5XHJcbiAgdmFyIG9wYWNpdHkgPSBtYXJrc0NvbmZpZy5vcGFjaXR5O1xyXG4gIGlmIChvcGFjaXR5KSB7XHJcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW5lKG1vZGVsOiBNb2RlbCkge1xyXG4gIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxyXG4gIHZhciBwOmFueSA9IHt9O1xyXG5cclxuICAvLyB4XHJcbiAgaWYgKG1vZGVsLmhhcyhYKSkge1xyXG4gICAgcC54ID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHtiaW5TdWZmaXg6ICdfbWlkJ30pXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhYKSkge1xyXG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcclxuICB9XHJcblxyXG4gIC8vIHlcclxuICBpZiAobW9kZWwuaGFzKFkpKSB7XHJcbiAgICBwLnkgPSB7XHJcbiAgICAgIHNjYWxlOiBZLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwge2JpblN1ZmZpeDogJ19taWQnfSlcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFkpKSB7XHJcbiAgICBwLnkgPSB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fTtcclxuICB9XHJcblxyXG4gIC8vIHN0cm9rZVxyXG4gIGlmIChtb2RlbC5oYXMoQ09MT1IpKSB7XHJcbiAgICBwLnN0cm9rZSA9IHtcclxuICAgICAgc2NhbGU6IENPTE9SLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhDT0xPUikpIHtcclxuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xyXG4gIH1cclxuXHJcbiAgdmFyIG9wYWNpdHkgPSBtb2RlbC5jb25maWcoJ21hcmtzJykub3BhY2l0eTtcclxuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcclxuXHJcbiAgcC5zdHJva2VXaWR0aCA9IHt2YWx1ZTogbW9kZWwuY29uZmlnKCdtYXJrcycpLnN0cm9rZVdpZHRofTtcclxuXHJcbiAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbi8vIFRPRE8oIzY5NCk6IG9wdGltaXplIGFyZWEncyB1c2FnZSB3aXRoIGJpblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlYShtb2RlbDogTW9kZWwpIHtcclxuICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XHJcblxyXG4gIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxyXG4gIHZhciBwOmFueSA9IHt9O1xyXG5cclxuICAvLyB4XHJcbiAgaWYgKHN0YWNrICYmIFggPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xyXG4gICAgcC54ID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpICsgJ19zdGFydCdcclxuICAgIH07XHJcbiAgICBwLngyID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpICsgJ19lbmQnXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAobW9kZWwuaXNNZWFzdXJlKFgpKSB7XHJcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBtb2RlbC5maWVsZChYKX07XHJcbiAgICBpZiAobW9kZWwuaXNEaW1lbnNpb24oWSkpIHtcclxuICAgICAgcC54MiA9IHtcclxuICAgICAgICBzY2FsZTogWCxcclxuICAgICAgICB2YWx1ZTogMFxyXG4gICAgICB9O1xyXG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKG1vZGVsLmhhcyhYKSkge1xyXG4gICAgcC54ID0ge1xyXG4gICAgICBzY2FsZTogWCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHtiaW5TdWZmaXg6ICdfbWlkJ30pXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xyXG4gIH1cclxuXHJcbiAgLy8geVxyXG4gIGlmIChzdGFjayAmJiBZID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcclxuICAgIHAueSA9IHtcclxuICAgICAgc2NhbGU6IFksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKSArICdfc3RhcnQnXHJcbiAgICB9O1xyXG4gICAgcC55MiA9IHtcclxuICAgICAgc2NhbGU6IFksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKSArICdfZW5kJ1xyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShZKSkge1xyXG4gICAgcC55ID0ge1xyXG4gICAgICBzY2FsZTogWSxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXHJcbiAgICB9O1xyXG4gICAgcC55MiA9IHtcclxuICAgICAgc2NhbGU6IFksXHJcbiAgICAgIHZhbHVlOiAwXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAobW9kZWwuaGFzKFkpKSB7XHJcbiAgICBwLnkgPSB7XHJcbiAgICAgIHNjYWxlOiBZLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwge2JpblN1ZmZpeDogJ19taWQnfSlcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHAueSA9IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319O1xyXG4gIH1cclxuXHJcbiAgLy8gZmlsbFxyXG4gIGlmIChtb2RlbC5oYXMoQ09MT1IpKSB7XHJcbiAgICBwLmZpbGwgPSB7XHJcbiAgICAgIHNjYWxlOiBDT0xPUixcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTE9SKVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoQ09MT1IpKSB7XHJcbiAgICBwLmZpbGwgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XHJcbiAgfVxyXG5cclxuICB2YXIgb3BhY2l0eSA9IG1vZGVsLmNvbmZpZygnbWFya3MnKS5vcGFjaXR5O1xyXG4gIGlmIChvcGFjaXR5KSB7XHJcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aWNrKG1vZGVsOiBNb2RlbCkge1xyXG4gIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxyXG4gIC8vIEZJWE1FIGFyZSAvMyAsIC8xLjUgZGl2aXNpb25zIGhlcmUgY29ycmVjdD9cclxuICB2YXIgcDphbnkgPSB7fTtcclxuXHJcbiAgLy8geFxyXG4gIGlmIChtb2RlbC5oYXMoWCkpIHtcclxuICAgIHAueCA9IHtcclxuICAgICAgc2NhbGU6IFgsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7YmluU3VmZml4OiAnX21pZCd9KVxyXG4gICAgfTtcclxuICAgIGlmIChtb2RlbC5pc0RpbWVuc2lvbihYKSkge1xyXG4gICAgICBwLngub2Zmc2V0ID0gLW1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCAvIDM7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFgpKSB7XHJcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xyXG4gIH1cclxuXHJcbiAgLy8geVxyXG4gIGlmIChtb2RlbC5oYXMoWSkpIHtcclxuICAgIHAueSA9IHtcclxuICAgICAgc2NhbGU6IFksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7YmluU3VmZml4OiAnX21pZCd9KVxyXG4gICAgfTtcclxuICAgIGlmIChtb2RlbC5pc0RpbWVuc2lvbihZKSkge1xyXG4gICAgICBwLnkub2Zmc2V0ID0gLW1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlLmJhbmRXaWR0aCAvIDM7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFkpKSB7XHJcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xyXG4gIH1cclxuXHJcbiAgLy8gd2lkdGhcclxuICBpZiAoIW1vZGVsLmhhcyhYKSB8fCBtb2RlbC5pc0RpbWVuc2lvbihYKSkge1xyXG4gICAgLy8gVE9ETygjNjk0KTogb3B0aW1pemUgdGljaydzIHdpZHRoIGZvciBiaW5cclxuICAgIHAud2lkdGggPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCAvIDEuNX07XHJcbiAgfSBlbHNlIHtcclxuICAgIHAud2lkdGggPSB7dmFsdWU6IDF9O1xyXG4gIH1cclxuXHJcbiAgLy8gaGVpZ2h0XHJcbiAgaWYgKCFtb2RlbC5oYXMoWSkgfHwgbW9kZWwuaXNEaW1lbnNpb24oWSkpIHtcclxuICAgIC8vIFRPRE8oIzY5NCk6IG9wdGltaXplIHRpY2sncyBoZWlnaHQgZm9yIGJpblxyXG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlLmJhbmRXaWR0aCAvIDEuNX07XHJcbiAgfSBlbHNlIHtcclxuICAgIHAuaGVpZ2h0ID0ge3ZhbHVlOiAxfTtcclxuICB9XHJcblxyXG4gIC8vIGZpbGxcclxuICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xyXG4gICAgcC5maWxsID0ge1xyXG4gICAgICBzY2FsZTogQ09MT1IsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHAuZmlsbCA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlfTtcclxuICB9XHJcblxyXG4gIHZhciBvcGFjaXR5ID0gbW9kZWwuY29uZmlnKCdtYXJrcycpLm9wYWNpdHk7XHJcbiAgaWYgKG9wYWNpdHkpIHtcclxuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbGVkX3BvaW50X3Byb3BzKHNoYXBlKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKG1vZGVsOiBNb2RlbCkge1xyXG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXHJcbiAgICB2YXIgcDphbnkgPSB7fTtcclxuXHJcbiAgICAvLyB4XHJcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XHJcbiAgICAgIHAueCA9IHtcclxuICAgICAgICBzY2FsZTogWCxcclxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwge2JpblN1ZmZpeDogJ19taWQnfSlcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhYKSkge1xyXG4gICAgICBwLnggPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCAvIDJ9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHlcclxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcclxuICAgICAgcC55ID0ge1xyXG4gICAgICAgIHNjYWxlOiBZLFxyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7YmluU3VmZml4OiAnX21pZCd9KVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFkpKSB7XHJcbiAgICAgIHAueSA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoIC8gMn07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2l6ZVxyXG4gICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xyXG4gICAgICBwLnNpemUgPSB7XHJcbiAgICAgICAgc2NhbGU6IFNJWkUsXHJcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoWCkpIHtcclxuICAgICAgcC5zaXplID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihTSVpFKS52YWx1ZX07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2hhcGVcclxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcclxuXHJcbiAgICAvLyBmaWxsXHJcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xyXG4gICAgICBwLmZpbGwgPSB7XHJcbiAgICAgICAgc2NhbGU6IENPTE9SLFxyXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSBpZiAoIW1vZGVsLmhhcyhDT0xPUikpIHtcclxuICAgICAgcC5maWxsID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvcGFjaXR5ID0gbW9kZWwuY29uZmlnKCdtYXJrcycpLm9wYWNpdHk7XHJcbiAgICBpZiAob3BhY2l0eSkge1xyXG4gICAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaXJjbGUgPSBmaWxsZWRfcG9pbnRfcHJvcHMoJ2NpcmNsZScpO1xyXG5leHBvcnQgY29uc3Qgc3F1YXJlID0gZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXh0QmFja2dyb3VuZChtb2RlbDogTW9kZWwpIHtcclxuICByZXR1cm4ge1xyXG4gICAgeDoge3ZhbHVlOiAwfSxcclxuICAgIHk6IHt2YWx1ZTogMH0sXHJcbiAgICB3aWR0aDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcclxuICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0sXHJcbiAgICBmaWxsOiB7c2NhbGU6IENPTE9SLCBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpfVxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXh0KG1vZGVsOiBNb2RlbCkge1xyXG4gIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxyXG4gIGxldCBwOmFueSA9IHt9O1xyXG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoVEVYVCk7XHJcbiAgY29uc3QgbWFya3NDb25maWcgPSBtb2RlbC5jb25maWcoJ21hcmtzJyk7XHJcblxyXG4gIC8vIHhcclxuICBpZiAobW9kZWwuaGFzKFgpKSB7XHJcbiAgICBwLnggPSB7XHJcbiAgICAgIHNjYWxlOiBYLFxyXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwge2JpblN1ZmZpeDogJ19taWQnfSlcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICghbW9kZWwuaGFzKFgpKSB7XHJcbiAgICBpZiAobW9kZWwuaGFzKFRFWFQpICYmIG1vZGVsLmZpZWxkRGVmKFRFWFQpLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xyXG4gICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgLTUgb2Zmc2V0IGEgY29uZmlnXHJcbiAgICAgIHAueCA9IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfSwgb2Zmc2V0OiAtNX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwLnggPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCAvIDJ9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8geVxyXG4gIGlmIChtb2RlbC5oYXMoWSkpIHtcclxuICAgIHAueSA9IHtcclxuICAgICAgc2NhbGU6IFksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7YmluU3VmZml4OiAnX21pZCd9KVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoWSkpIHtcclxuICAgIHAueSA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoIC8gMn07XHJcbiAgfVxyXG5cclxuICAvLyBzaXplXHJcbiAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xyXG4gICAgcC5mb250U2l6ZSA9IHtcclxuICAgICAgc2NhbGU6IFNJWkUsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKCFtb2RlbC5oYXMoU0laRSkpIHtcclxuICAgIHAuZm9udFNpemUgPSB7dmFsdWU6IGZpZWxkRGVmLmZvbnRTaXplfTtcclxuICB9XHJcblxyXG4gIC8vIGZpbGxcclxuICAvLyBUT0RPOiBjb25zaWRlciBpZiBjb2xvciBzaG91bGQganVzdCBtYXAgdG8gZmlsbCBpbnN0ZWFkP1xyXG5cclxuXHJcbiAgdmFyIG9wYWNpdHkgPSBtb2RlbC5jb25maWcoJ21hcmtzJykub3BhY2l0eTtcclxuXHJcbiAgLy8gZGVmYXVsdCBvcGFjaXR5IGluIHZlZ2EgaXMgMSBpZiB3ZSBkb24ndCBzZXQgaXRcclxuICBpZiAob3BhY2l0eSkge1xyXG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcclxuICB9XHJcblxyXG4gIC8vIHRleHRcclxuICBpZiAobW9kZWwuaGFzKFRFWFQpKSB7XHJcbiAgICBpZiAobW9kZWwuZmllbGREZWYoVEVYVCkudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XHJcbiAgICAgIC8vIFRPRE86IHJldmlzZSB0aGlzIGxpbmVcclxuICAgICAgdmFyIG51bWJlckZvcm1hdCA9IG1hcmtzQ29uZmlnLmZvcm1hdCAhPT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtzQ29uZmlnLmZvcm1hdCA6IG1vZGVsLm51bWJlckZvcm1hdChURVhUKTtcclxuXHJcbiAgICAgIHAudGV4dCA9IHt0ZW1wbGF0ZTogJ3t7JyArIG1vZGVsLmZpZWxkKFRFWFQsIHtkYXR1bTogdHJ1ZX0pICtcclxuICAgICAgICAgICAgICAgJyB8IG51bWJlcjpcXCcnICsgbnVtYmVyRm9ybWF0ICsnXFwnfX0nfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHAudGV4dCA9IHtmaWVsZDogbW9kZWwuZmllbGQoVEVYVCl9O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBwLnRleHQgPSB7dmFsdWU6IGZpZWxkRGVmLnZhbHVlfTtcclxuICB9XHJcblxyXG5cclxuICBbJ2FsaWduJywgJ2Jhc2VsaW5lJywgJ2ZpbGwnLCAnZm9udCcsICdmb250V2VpZ2h0JywgJ2ZvbnRTdHlsZSddXHJcbiAgICAuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IG1hcmtzQ29uZmlnW3Byb3BlcnR5XTtcclxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIHJldHVybiBwO1xyXG59XHJcbn1cclxuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL2RvYy9zcGVjLm1kIzExLWFtYmllbnQtZGVjbGFyYXRpb25zXHJcbmRlY2xhcmUgdmFyIGV4cG9ydHM7XHJcblxyXG5pbXBvcnQge2V4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XHJcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xyXG5pbXBvcnQge1NIQVJFRF9ET01BSU5fT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xyXG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSEFQRSwgU0laRSwgQ09MT1IsIFRFWFQsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xyXG5pbXBvcnQge1NPVVJDRSwgU1RBQ0tFRCwgTEFZT1VUfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0ICogYXMgdGltZSBmcm9tICcuL3RpbWUnO1xyXG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVTY2FsZXMobmFtZXM6IEFycmF5PHN0cmluZz4sIG1vZGVsOiBNb2RlbCkge1xyXG4gIHJldHVybiBuYW1lcy5yZWR1Y2UoZnVuY3Rpb24oYSwgY2hhbm5lbDogQ2hhbm5lbCkge1xyXG4gICAgdmFyIHNjYWxlRGVmOiBhbnkgPSB7XHJcbiAgICAgIG5hbWU6IGNoYW5uZWwsXHJcbiAgICAgIHR5cGU6IHR5cGUoY2hhbm5lbCwgbW9kZWwpLFxyXG4gICAgfTtcclxuXHJcbiAgICBzY2FsZURlZi5kb21haW4gPSBkb21haW4obW9kZWwsIGNoYW5uZWwsIHNjYWxlRGVmLnR5cGUpO1xyXG4gICAgZXh0ZW5kKHNjYWxlRGVmLCByYW5nZU1peGlucyhtb2RlbCwgY2hhbm5lbCwgc2NhbGVEZWYudHlwZSkpO1xyXG5cclxuICAgIC8vIEFkZCBvcHRpb25hbCBwcm9wZXJ0aWVzXHJcbiAgICBbXHJcbiAgICAgIC8vIGdlbmVyYWwgcHJvcGVydGllc1xyXG4gICAgICAncmV2ZXJzZScsICdyb3VuZCcsXHJcbiAgICAgIC8vIHF1YW50aXRhdGl2ZSAvIHRpbWVcclxuICAgICAgJ2NsYW1wJywgJ25pY2UnLFxyXG4gICAgICAvLyBxdWFudGl0YXRpdmVcclxuICAgICAgJ2V4cG9uZW50JywgJ3plcm8nLFxyXG4gICAgICAvLyBvcmRpbmFsXHJcbiAgICAgICdiYW5kV2lkdGgnLCAnb3V0ZXJQYWRkaW5nJywgJ3BhZGRpbmcnLCAncG9pbnRzJ1xyXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XHJcbiAgICAgIC8vIFRPRE8gaW5jbHVkZSBmaWVsZERlZiBhcyBwYXJ0IG9mIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICAgIHZhciB2YWx1ZSA9IGV4cG9ydHNbcHJvcGVydHldKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKTtcclxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzY2FsZURlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIChhLnB1c2goc2NhbGVEZWYpLCBhKTtcclxuICB9LCBbXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0eXBlKGNoYW5uZWw6IENoYW5uZWwsIG1vZGVsOiBNb2RlbCkge1xyXG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XHJcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XHJcbiAgICBjYXNlIE5PTUlOQUw6IC8vZmFsbCB0aHJvdWdoXHJcbiAgICAgIHJldHVybiAnb3JkaW5hbCc7XHJcbiAgICBjYXNlIE9SRElOQUw6XHJcbiAgICAgIGxldCByYW5nZSA9IGZpZWxkRGVmLnNjYWxlLnJhbmdlO1xyXG4gICAgICByZXR1cm4gY2hhbm5lbCA9PT0gQ09MT1IgJiYgKHR5cGVvZiByYW5nZSAhPT0gJ3N0cmluZycpID8gJ2xpbmVhcicgOiAnb3JkaW5hbCc7XHJcbiAgICBjYXNlIFRFTVBPUkFMOlxyXG4gICAgICByZXR1cm4gZmllbGREZWYudGltZVVuaXQgPyB0aW1lLnNjYWxlLnR5cGUoZmllbGREZWYudGltZVVuaXQsIGNoYW5uZWwpIDogJ3RpbWUnO1xyXG4gICAgY2FzZSBRVUFOVElUQVRJVkU6XHJcbiAgICAgIGlmIChtb2RlbC5iaW4oY2hhbm5lbCkpIHtcclxuICAgICAgICByZXR1cm4gY2hhbm5lbCA9PT0gUk9XIHx8IGNoYW5uZWwgPT09IENPTFVNTiB8fCBjaGFubmVsID09PSBTSEFQRSA/ICdvcmRpbmFsJyA6ICdsaW5lYXInO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmaWVsZERlZi5zY2FsZS50eXBlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6Q2hhbm5lbCwgdHlwZSkge1xyXG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xyXG5cclxuICBpZiAoZmllbGREZWYuc2NhbGUuZG9tYWluKSB7IC8vIGV4cGxpY2l0IHZhbHVlXHJcbiAgICByZXR1cm4gZmllbGREZWYuc2NhbGUuZG9tYWluO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lhbCBjYXNlIGZvciB0ZW1wb3JhbCBzY2FsZVxyXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xyXG4gICAgdmFyIHJhbmdlID0gdGltZS5zY2FsZS5kb21haW4oZmllbGREZWYudGltZVVuaXQsIGNoYW5uZWwpO1xyXG4gICAgaWYgKHJhbmdlKSByZXR1cm4gcmFuZ2U7XHJcbiAgfVxyXG5cclxuICAvLyBGb3Igc3RhY2ssIHVzZSBTVEFDS0VEIGRhdGEuXHJcbiAgdmFyIHN0YWNrID0gbW9kZWwuc3RhY2soKTtcclxuICBpZiAoc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XHJcbiAgICBjb25zdCBmYWNldCA9IG1vZGVsLmhhcyhST1cpIHx8IG1vZGVsLmhhcyhDT0xVTU4pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGF0YTogU1RBQ0tFRCxcclxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtcclxuICAgICAgICAvLyBJZiBmYWNldGVkLCBzY2FsZSBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBtYXggb2Ygc3VtIGluIGVhY2ggZmFjZXQuXHJcbiAgICAgICAgcHJlZm46IChmYWNldCA/ICdtYXhfJyA6ICcnKSArICdzdW1fJ1xyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHZhciB1c2VSYXdEb21haW4gPSBfdXNlUmF3RG9tYWluKG1vZGVsLCBjaGFubmVsKTtcclxuICB2YXIgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsIGNoYW5uZWwsIHR5cGUpO1xyXG5cclxuICBpZiAodXNlUmF3RG9tYWluKSB7IC8vIHVzZVJhd0RvbWFpbiAtIG9ubHkgUS9UXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkYXRhOiBTT1VSQ0UsXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7bm9BZ2dyZWdhdGU6dHJ1ZX0pXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxyXG4gICAgICBmaWVsZDogdHlwZSA9PT0gJ29yZGluYWwnID9cclxuICAgICAgICAvLyBvcmRpbmFsIHNjYWxlIG9ubHkgdXNlIGJpbiBzdGFydCBmb3Igbm93XHJcbiAgICAgICAgbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pIDpcclxuICAgICAgICAvLyBuZWVkIHRvIG1lcmdlIGJvdGggYmluX3N0YXJ0IGFuZCBiaW5fZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxyXG4gICAgICAgIFtcclxuICAgICAgICAgIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcclxuICAgICAgICAgIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX2VuZCcgfSlcclxuICAgICAgICBdXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoc29ydCkgeyAvLyBoYXZlIHNvcnQgLS0gb25seSBmb3Igb3JkaW5hbFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBTT1VSQ0UgdGFibGUsXHJcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxyXG4gICAgICBkYXRhOiBzb3J0Lm9wID8gU09VUkNFIDogbW9kZWwuZGF0YVRhYmxlKCksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcclxuICAgICAgc29ydDogc29ydFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXHJcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgdHlwZSk6YW55IHtcclxuICB2YXIgc29ydCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNvcnQ7XHJcbiAgaWYgKHNvcnQgPT09ICdhc2NlbmRpbmcnIHx8IHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcclxuICBpZiAodHlwZSA9PT0gJ29yZGluYWwnICYmIHR5cGVvZiBzb3J0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb3A6IHNvcnQub3AsXHJcbiAgICAgIGZpZWxkOiBzb3J0LmZpZWxkXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICB2YXIgc29ydCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNvcnQ7XHJcbiAgcmV0dXJuIHNvcnQgJiYgKHR5cGVvZiBzb3J0ID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnIDpcclxuICAgICAgICAgICAgICAgICAgICBzb3J0Lm9yZGVyID09PSAnZGVzY2VuZGluZydcclxuICAgICAgICAgICAgICAgICApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB1c2VSYXdEb21haW4gc2hvdWxkIGJlIGFjdGl2YXRlZCBmb3IgdGhpcyBzY2FsZS5cclxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdG9ucyBhcHBsaWVzOlxyXG4gKiAxLiBgdXNlUmF3RG9tYWluYCBpcyBlbmFibGVkIGVpdGhlciB0aHJvdWdoIHNjYWxlIG9yIGNvbmZpZ1xyXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxyXG4gKiAzLiBUaGUgc2NhbGUgaXMgcXVhbnRpdGF0aXZlIG9yIHRpbWUgc2NhbGUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX3VzZVJhd0RvbWFpbiAobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuXHJcbiAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnVzZVJhd0RvbWFpbiAmJiAvLyAgaWYgdXNlUmF3RG9tYWluIGlzIGVuYWJsZWRcclxuICAgIC8vIG9ubHkgYXBwbGllZCB0byBhZ2dyZWdhdGUgdGFibGVcclxuICAgIGZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJlxyXG4gICAgLy8gb25seSBhY3RpdmF0ZWQgaWYgdXNlZCB3aXRoIGFnZ3JlZ2F0ZSBmdW5jdGlvbnMgdGhhdCBwcm9kdWNlcyB2YWx1ZXMgcmFuZ2luZyBpbiB0aGUgZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YVxyXG4gICAgU0hBUkVEX0RPTUFJTl9PUFMuaW5kZXhPZihmaWVsZERlZi5hZ2dyZWdhdGUpID49IDAgJiZcclxuICAgIChcclxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBxdWFudGl0YXRpdmUgc2NhbGUgZXhjZXB0IHdoZW4gaXQncyBiaW5uZWQuXHJcbiAgICAgIC8vIEJpbm5lZCBmaWVsZCBoYXMgc2ltaWxhciB2YWx1ZXMgaW4gYm90aCB0aGUgc291cmNlIHRhYmxlIGFuZCB0aGUgc3VtbWFyeSB0YWJsZVxyXG4gICAgICAvLyBidXQgdGhlIHN1bW1hcnkgdGFibGUgaGFzIGZld2VyIHZhbHVlcywgdGhlcmVmb3JlIGJpbm5lZCBmaWVsZHMgZHJhd1xyXG4gICAgICAvLyBkb21haW4gdmFsdWVzIGZyb20gdGhlIHN1bW1hcnkgdGFibGUuXHJcbiAgICAgIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUgJiYgIWZpZWxkRGVmLmJpbikgfHxcclxuICAgICAgLy8gVCB1c2VzIG5vbi1vcmRpbmFsIHNjYWxlIHdoZW4gdGhlcmUncyBubyB1bml0IG9yIHdoZW4gdGhlIHVuaXQgaXMgbm90IG9yZGluYWwuXHJcbiAgICAgIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJlxyXG4gICAgICAgICghZmllbGREZWYudGltZVVuaXQgfHwgdGltZS5zY2FsZS50eXBlKGZpZWxkRGVmLnRpbWVVbml0LCBjaGFubmVsKSA9PT0gJ2xpbmVhcicpXHJcbiAgICAgIClcclxuICAgICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBiYW5kV2lkdGgobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGUpIHtcclxuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcclxuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGg7XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICAvLyBvbmx5IHJldHVybiB2YWx1ZSBpZiBleHBsaWNpdCB2YWx1ZSBpcyBzcGVjaWZpZWQuXHJcbiAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLmNsYW1wO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb25lbnQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgLy8gb25seSByZXR1cm4gdmFsdWUgaWYgZXhwbGljaXQgdmFsdWUgaXMgc3BlY2lmaWVkLlxyXG4gIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5leHBvbmVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5pY2UobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGUpIHtcclxuICBpZiAobW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUubmljZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvLyBleHBsaWNpdCB2YWx1ZVxyXG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm5pY2U7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcclxuICAgIGNhc2UgWDogLyogZmFsbCB0aHJvdWdoICovXHJcbiAgICBjYXNlIFk6XHJcbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICd0aW1lJyB8fCBzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgY2FzZSBST1c6IC8qIGZhbGwgdGhyb3VnaCAqL1xyXG4gICAgY2FzZSBDT0xVTU46XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3V0ZXJQYWRkaW5nKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlKSB7XHJcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICBpZiAobW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUub3V0ZXJQYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm91dGVyUGFkZGluZzsgLy8gZXhwbGljaXQgdmFsdWVcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmcobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGUpIHtcclxuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcclxuICAgIC8vIEJvdGggZXhwbGljaXQgYW5kIG5vbi1leHBsaWNpdCB2YWx1ZXMgYXJlIGhhbmRsZWQgYnkgdGhlIGhlbHBlciBtZXRob2QuXHJcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUucGFkZGluZztcclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50cyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZSkge1xyXG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xyXG4gICAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnBvaW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIC8vIGV4cGxpY2l0IHZhbHVlXHJcbiAgICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5wb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChjaGFubmVsKSB7XHJcbiAgICAgIGNhc2UgWDpcclxuICAgICAgY2FzZSBZOlxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlTWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlKTogYW55IHtcclxuICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuXHJcbiAgaWYgKGZpZWxkRGVmLnNjYWxlLnJhbmdlKSB7IC8vIGV4cGxpY2l0IHZhbHVlXHJcbiAgICByZXR1cm4ge3JhbmdlOiBmaWVsZERlZi5zY2FsZS5yYW5nZX07XHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcclxuICAgIGNhc2UgWDpcclxuICAgICAgcmV0dXJuIHsgcmFuZ2VNaW46IDAsIHJhbmdlTWF4OiBtb2RlbC5sYXlvdXQoKS5jZWxsV2lkdGh9O1xyXG4gICAgY2FzZSBZOlxyXG4gICAgICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcclxuICAgICAgICByZXR1cm4ge3JhbmdlTWluOiAwLCByYW5nZU1heDogbW9kZWwubGF5b3V0KCkuY2VsbEhlaWdodH07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtyYW5nZU1pbjogbW9kZWwubGF5b3V0KCkuY2VsbEhlaWdodCwgcmFuZ2VNYXggOjB9O1xyXG4gICAgY2FzZSBTSVpFOlxyXG4gICAgICBpZiAobW9kZWwuaXMoJ2JhcicpKSB7XHJcbiAgICAgICAgLy8gRklYTUUgdGhpcyBpcyBkZWZpbml0ZWx5IGluY29ycmVjdFxyXG4gICAgICAgIC8vIGJ1dCBsZXQncyBmaXggaXQgbGF0ZXIgc2luY2UgYmFyIHNpemUgaXMgYSBiYWQgZW5jb2RpbmcgYW55d2F5XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHJhbmdlOiBbMywgTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCxcclxuICAgICAgICAgICAgbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoXHJcbiAgICAgICAgICApXVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSBpZiAobW9kZWwuaXMoVEVYVCkpIHtcclxuICAgICAgICByZXR1cm4ge3JhbmdlOiBbOCwgNDBdfTtcclxuICAgICAgfVxyXG4gICAgICAvLyBlbHNlIC0tIHBvaW50XHJcbiAgICAgIHZhciBiYW5kV2lkdGggPSBNYXRoLm1pbihtb2RlbC5maWVsZERlZihYKS5zY2FsZS5iYW5kV2lkdGgsIG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlLmJhbmRXaWR0aCkgLSAxO1xyXG4gICAgICByZXR1cm4ge3JhbmdlOiBbMTAsIDAuOCAqIGJhbmRXaWR0aCpiYW5kV2lkdGhdfTtcclxuICAgIGNhc2UgU0hBUEU6XHJcbiAgICAgIHJldHVybiB7cmFuZ2U6ICdzaGFwZXMnfTtcclxuICAgIGNhc2UgQ09MT1I6XHJcbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xyXG4gICAgICAgIHJldHVybiB7cmFuZ2U6ICdjYXRlZ29yeTEwJ307XHJcbiAgICAgIH0gZWxzZSB7IC8vdGltZSBvciBxdWFudGl0YXRpdmVcclxuICAgICAgICByZXR1cm4ge3JhbmdlOiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddfTsgLy8gdGFibGVhdSBncmVlbnNcclxuICAgICAgfVxyXG4gICAgY2FzZSBST1c6XHJcbiAgICAgIHJldHVybiB7cmFuZ2U6ICdoZWlnaHQnfTtcclxuICAgIGNhc2UgQ09MVU1OOlxyXG4gICAgICByZXR1cm4ge3JhbmdlOiAnd2lkdGgnfTtcclxuICB9XHJcbiAgcmV0dXJuIHt9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm91bmQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XHJcbiAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnJvdW5kICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5yb3VuZDtcclxuICB9XHJcblxyXG4gIC8vIEZJWE1FOiByZXZpc2UgaWYgcm91bmQgaXMgYWxyZWFkeSB0aGUgZGVmYXVsdCB2YWx1ZVxyXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xyXG4gICAgY2FzZSBYOiAvKiBmYWxsIHRocm91Z2ggKi9cclxuICAgIGNhc2UgWTpcclxuICAgIGNhc2UgUk9XOlxyXG4gICAgY2FzZSBDT0xVTU46XHJcbiAgICBjYXNlIFNJWkU6XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gemVybyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcclxuICB2YXIgdGltZVVuaXQgPSBmaWVsZERlZi50aW1lVW5pdDtcclxuXHJcbiAgaWYgKGZpZWxkRGVmLnNjYWxlLnplcm8gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gZXhwbGljaXQgdmFsdWVcclxuICAgIHJldHVybiBmaWVsZERlZi5zY2FsZS56ZXJvO1xyXG4gIH1cclxuXHJcbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMKSB7XHJcbiAgICBpZiAodGltZVVuaXQgPT09ICd5ZWFyJykge1xyXG4gICAgICAvLyB5ZWFyIGlzIHVzaW5nIGxpbmVhciBzY2FsZSwgYnV0IHNob3VsZCBub3QgaW5jbHVkZSB6ZXJvXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHRpbWVVbml0IG9yIHRoZSB0aW1lVW5pdCB1c2VzIG9yZGluYWwgc2NhbGUsXHJcbiAgICAvLyB6ZXJvIHByb3BlcnR5IGlzIGlnbm9yZWQgYnkgdmVnYSBzbyB3ZSBzaG91bGQgbm90IGdlbmVyYXRlIHRoZW0gYW55IHdheVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xyXG4gICAgLy8gUmV0dXJucyBmYWxzZSAodW5kZWZpbmVkKSBieSBkZWZhdWx0IG9mIGJpblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNoYW5uZWwgPT09IFggfHwgY2hhbm5lbCA9PT0gWSA/XHJcbiAgICAvLyBpZiBub3QgYmluIC8gdGVtcG9yYWwsIHJldHVybnMgdW5kZWZpbmVkIGZvciBYIGFuZCBZIGVuY29kaW5nXHJcbiAgICAvLyBzaW5jZSB6ZXJvIGlzIHRydWUgYnkgZGVmYXVsdCBpbiB2ZWdhIGZvciBsaW5lYXIgc2NhbGVcclxuICAgIHVuZGVmaW5lZCA6XHJcbiAgICBmYWxzZTtcclxufVxyXG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcclxuaW1wb3J0IHtDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcclxuaW1wb3J0IHtpc09iamVjdH0gZnJvbSAnLi4vdXRpbCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrUHJvcGVydGllcyB7XHJcbiAgZ3JvdXBieUNoYW5uZWw6IENoYW5uZWw7XHJcbiAgZmllbGRDaGFubmVsOiBDaGFubmVsO1xyXG4gIHN0YWNrQ2hhbm5lbDogQ2hhbm5lbDsgLy8gQ09MT1Igb3IgREVUQUlMXHJcbiAgY29uZmlnOiBhbnk7XHJcbn1cclxuXHJcbi8vIFRPRE86IHB1dCBhbGwgdmVnYSBpbnRlcmZhY2UgaW4gb25lIHBsYWNlXHJcbmludGVyZmFjZSBTdGFja1RyYW5zZm9ybSB7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIG9mZnNldD86IGFueTtcclxuICBncm91cGJ5OiBhbnk7XHJcbiAgZmllbGQ6IGFueTtcclxuICBzb3J0Ynk6IGFueTtcclxuICBvdXRwdXQ6IGFueTtcclxufVxyXG5cclxuLy8gaW1wdXRlIGRhdGEgZm9yIHN0YWNrZWQgYXJlYVxyXG5leHBvcnQgZnVuY3Rpb24gaW1wdXRlVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xyXG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogJ2ltcHV0ZScsXHJcbiAgICBmaWVsZDogbW9kZWwuZmllbGQoc3RhY2suZmllbGRDaGFubmVsKSxcclxuICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChzdGFjay5zdGFja0NoYW5uZWwpXSxcclxuICAgIG9yZGVyYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxyXG4gICAgbWV0aG9kOiAndmFsdWUnLFxyXG4gICAgdmFsdWU6IDBcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhY2tUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XHJcbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xyXG4gIGNvbnN0IHNvcnRieSA9IHN0YWNrLmNvbmZpZy5zb3J0ID09PSAnZGVzY2VuZGluZycgP1xyXG4gICAgICAgICAgICAgICAgICAgJy0nICsgbW9kZWwuZmllbGQoc3RhY2suc3RhY2tDaGFubmVsKSA6XHJcbiAgICAgICAgICAgICAgICAgc3RhY2suY29uZmlnLnNvcnQgPT09ICdhc2NlbmRpbmcnID9cclxuICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKHN0YWNrLnN0YWNrQ2hhbm5lbCkgOlxyXG4gICAgICAgICAgICAgICAgIGlzT2JqZWN0KHN0YWNrLmNvbmZpZy5zb3J0KSA/XHJcbiAgICAgICAgICAgICAgICAgICBzdGFjay5jb25maWcuc29ydCA6XHJcbiAgICAgICAgICAgICAgICAgICAnLScgKyBtb2RlbC5maWVsZChzdGFjay5zdGFja0NoYW5uZWwpOyAvLyBkZWZhdWx0XHJcblxyXG4gIGNvbnN0IHZhbE5hbWUgPSBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpO1xyXG5cclxuICAvLyBhZGQgc3RhY2sgdHJhbnNmb3JtIHRvIG1hcmtcclxuICB2YXIgdHJhbnNmb3JtOiBTdGFja1RyYW5zZm9ybSA9IHtcclxuICAgIHR5cGU6ICdzdGFjaycsXHJcbiAgICBncm91cGJ5OiBbbW9kZWwuZmllbGQoc3RhY2suZ3JvdXBieUNoYW5uZWwpXSxcclxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxyXG4gICAgc29ydGJ5OiBzb3J0YnksXHJcbiAgICBvdXRwdXQ6IHtcclxuICAgICAgc3RhcnQ6IHZhbE5hbWUgKyAnX3N0YXJ0JyxcclxuICAgICAgZW5kOiB2YWxOYW1lICsgJ19lbmQnXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaWYgKHN0YWNrLmNvbmZpZy5vZmZzZXQpIHtcclxuICAgIHRyYW5zZm9ybS5vZmZzZXQgPSBzdGFjay5jb25maWcub2Zmc2V0O1xyXG4gIH1cclxuICByZXR1cm4gdHJhbnNmb3JtO1xyXG59XHJcbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xyXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcclxuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XHJcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XHJcbmltcG9ydCB7Q09MT1IsIENPTFVNTiwgUk9XLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcclxuaW1wb3J0IHtURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FyZGluYWxpdHkoZmllbGREZWY6IEZpZWxkRGVmLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xyXG4gIHZhciB0aW1lVW5pdCA9IGZpZWxkRGVmLnRpbWVVbml0O1xyXG4gIHN3aXRjaCAodGltZVVuaXQpIHtcclxuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XHJcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIDYwO1xyXG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gMjQ7XHJcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcclxuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gMzE7XHJcbiAgICBjYXNlICdtb250aCc6IHJldHVybiAxMjtcclxuICAgIGNhc2UgJ3llYXInOlxyXG4gICAgICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkRGVmLmZpZWxkXSxcclxuICAgICAgICB5ZWFyc3RhdCA9IHN0YXRzWyd5ZWFyXycgKyBmaWVsZERlZi5maWVsZF07XHJcblxyXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gICAgICByZXR1cm4geWVhcnN0YXQuZGlzdGluY3QgLVxyXG4gICAgICAgIChzdGF0Lm1pc3NpbmcgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm11bGEodGltZVVuaXQsIGZpZWxkOiBzdHJpbmcpIHtcclxuICAvLyBUT0RPKGthbml0dyk6IGFkZCBmb3JtdWxhIHRvIG90aGVyIHRpbWUgZm9ybWF0XHJcbiAgdmFyIGZuID0gJ3V0YycgKyB0aW1lVW5pdDtcclxuICByZXR1cm4gZm4gKyAnKCcgKyBmaWVsZCArICcpJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlKHRpbWVVbml0LCBtb2RlbDogTW9kZWwpIHtcclxuICB2YXIgbGFiZWxMZW5ndGggPSBtb2RlbC5jb25maWcoJ3RpbWVTY2FsZUxhYmVsTGVuZ3RoJyksXHJcbiAgICBzY2FsZUxhYmVsO1xyXG4gIHN3aXRjaCAodGltZVVuaXQpIHtcclxuICAgIGNhc2UgJ2RheSc6XHJcbiAgICAgIHNjYWxlTGFiZWwgPSBtb2RlbC5jb25maWcoJ2RheVNjYWxlTGFiZWwnKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdtb250aCc6XHJcbiAgICAgIHNjYWxlTGFiZWwgPSBtb2RlbC5jb25maWcoJ21vbnRoU2NhbGVMYWJlbCcpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgaWYgKHNjYWxlTGFiZWwpIHtcclxuICAgIHJldHVybiBsYWJlbExlbmd0aCA/IHNjYWxlTGFiZWwubWFwKFxyXG4gICAgICAgIGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMuc3Vic3RyKDAsIGxhYmVsTGVuZ3RoKTt9XHJcbiAgICAgICkgOiBzY2FsZUxhYmVsO1xyXG4gIH1cclxuICByZXR1cm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzT3JkaW5hbEZuKHRpbWVVbml0KSB7XHJcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xyXG4gICAgY2FzZSAnc2Vjb25kcyc6XHJcbiAgICBjYXNlICdtaW51dGVzJzpcclxuICAgIGNhc2UgJ2hvdXJzJzpcclxuICAgIGNhc2UgJ2RheSc6XHJcbiAgICBjYXNlICdkYXRlJzpcclxuICAgIGNhc2UgJ21vbnRoJzpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBzY2FsZSB7XHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHR5cGUodGltZVVuaXQsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICAgIGlmIChjaGFubmVsID09PSBDT0xPUikge1xyXG4gICAgICByZXR1cm4gJ2xpbmVhcic7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gRklYTUUgcmV2aXNlIHRoaXMgLS0gc2hvdWxkICd5ZWFyJyBiZSBsaW5lYXIgdG9vP1xyXG4gICAgcmV0dXJuIGlzT3JkaW5hbEZuKHRpbWVVbml0KSB8fCBjaGFubmVsID09PSBDT0xVTU4gfHwgY2hhbm5lbCA9PT0gUk9XID8gJ29yZGluYWwnIDogJ2xpbmVhcic7XHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gZG9tYWluKHRpbWVVbml0LCBjaGFubmVsPzogQ2hhbm5lbCkge1xyXG4gICAgdmFyIGlzQ29sb3IgPSBjaGFubmVsID09PSBDT0xPUjtcclxuICAgIHN3aXRjaCAodGltZVVuaXQpIHtcclxuICAgICAgY2FzZSAnc2Vjb25kcyc6XHJcbiAgICAgIGNhc2UgJ21pbnV0ZXMnOiByZXR1cm4gaXNDb2xvciA/IFswLDU5XSA6IHV0aWwucmFuZ2UoMCwgNjApO1xyXG4gICAgICBjYXNlICdob3Vycyc6IHJldHVybiBpc0NvbG9yID8gWzAsMjNdIDogdXRpbC5yYW5nZSgwLCAyNCk7XHJcbiAgICAgIGNhc2UgJ2RheSc6IHJldHVybiBpc0NvbG9yID8gWzAsNl0gOiB1dGlsLnJhbmdlKDAsIDcpO1xyXG4gICAgICBjYXNlICdkYXRlJzogcmV0dXJuIGlzQ29sb3IgPyBbMSwzMV0gOiB1dGlsLnJhbmdlKDEsIDMyKTtcclxuICAgICAgY2FzZSAnbW9udGgnOiByZXR1cm4gaXNDb2xvciA/IFswLDExXSA6IHV0aWwucmFuZ2UoMCwgMTIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG4vKiogcmV0dXJucyB0aGUgdGVtcGxhdGUgbmFtZSB1c2VkIGZvciBheGlzIGxhYmVscyBmb3IgYSB0aW1lIHVuaXQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsVGVtcGxhdGUodGltZVVuaXQsIGFiYnJldmlhdGVkPWZhbHNlKSA6IHN0cmluZyB7XHJcbiAgdmFyIHBvc3RmaXggPSBhYmJyZXZpYXRlZCA/ICctYWJicmV2JyA6ICcnO1xyXG4gIHN3aXRjaCAodGltZVVuaXQpIHtcclxuICAgIGNhc2UgJ2RheSc6XHJcbiAgICAgIHJldHVybiAnZGF5JyArIHBvc3RmaXg7XHJcbiAgICBjYXNlICdtb250aCc6XHJcbiAgICAgIHJldHVybiAnbW9udGgnICsgcG9zdGZpeDtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuIiwiLypcclxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGRhdGEuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xyXG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4vdHlwZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU1VNTUFSWSA9ICdzdW1tYXJ5JztcclxuZXhwb3J0IGNvbnN0IFNPVVJDRSA9ICdzb3VyY2UnO1xyXG5leHBvcnQgY29uc3QgU1RBQ0tFRCA9ICdzdGFja2VkJztcclxuZXhwb3J0IGNvbnN0IExBWU9VVCA9ICdsYXlvdXQnO1xyXG5cclxuLyoqIE1hcHBpbmcgZnJvbSBkYXRhbGliJ3MgaW5mZXJyZWQgdHlwZSB0byBWZWdhLWxpdGUncyB0eXBlICovXHJcbi8vIFRPRE86IEFMTF9DQVBTXHJcbmV4cG9ydCBjb25zdCB0eXBlcyA9IHtcclxuICAnYm9vbGVhbic6IE5PTUlOQUwsXHJcbiAgJ251bWJlcic6IFFVQU5USVRBVElWRSxcclxuICAnaW50ZWdlcic6IFFVQU5USVRBVElWRSxcclxuICAnZGF0ZSc6IFRFTVBPUkFMLFxyXG4gICdzdHJpbmcnOiBOT01JTkFMXHJcbn07XHJcbiIsIi8vIHV0aWxpdHkgZm9yIGVuY29kaW5nIG1hcHBpbmdcclxuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hJztcclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcclxuaW1wb3J0IHtDaGFubmVsLCBDSEFOTkVMU30gZnJvbSAnLi9jaGFubmVsJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3VudFJldGluYWwoZW5jb2Rpbmc6IEVuY29kaW5nKSB7XHJcbiAgdmFyIGNvdW50ID0gMDtcclxuICBpZiAoZW5jb2RpbmcuY29sb3IpIGNvdW50Kys7XHJcbiAgaWYgKGVuY29kaW5nLnNpemUpIGNvdW50Kys7XHJcbiAgaWYgKGVuY29kaW5nLnNoYXBlKSBjb3VudCsrO1xyXG4gIHJldHVybiBjb3VudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhcyhlbmNvZGluZzogRW5jb2RpbmcsIGNoYW5uZWw6IENoYW5uZWwpIHtcclxuICB2YXIgZmllbGREZWY6IEZpZWxkRGVmID0gZW5jb2RpbmcgJiYgZW5jb2RpbmdbY2hhbm5lbF07XHJcbiAgcmV0dXJuIGZpZWxkRGVmICYmIGZpZWxkRGVmLmZpZWxkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBZ2dyZWdhdGUoZW5jb2Rpbmc6IEVuY29kaW5nKSB7XHJcbiAgZm9yICh2YXIgayBpbiBlbmNvZGluZykge1xyXG4gICAgaWYgKGhhcyhlbmNvZGluZywgaykgJiYgZW5jb2Rpbmdba10uYWdncmVnYXRlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKGVuY29kaW5nOiBFbmNvZGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgaTpudW1iZXIpID0+IHZvaWQpIHtcclxuICB2YXIgaSA9IDA7XHJcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XHJcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xyXG4gICAgICBmKGVuY29kaW5nW2NoYW5uZWxdLCBjaGFubmVsLCBpKyspO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwKGVuY29kaW5nOiBFbmNvZGluZyxcclxuICAgICAgICAgICAgICAgICAgICBmOiAoZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBlOiBFbmNvZGluZykgPT4gYW55KSB7XHJcbiAgdmFyIGFyciA9IFtdO1xyXG4gIENIQU5ORUxTLmZvckVhY2goZnVuY3Rpb24oaykge1xyXG4gICAgaWYgKGhhcyhlbmNvZGluZywgaykpIHtcclxuICAgICAgYXJyLnB1c2goZihlbmNvZGluZ1trXSwgaywgZW5jb2RpbmcpKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gYXJyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKGVuY29kaW5nOiBFbmNvZGluZyxcclxuICAgICAgICAgICAgICAgICAgZjogKGFjYzogYW55LCBmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksXHJcbiAgICAgICAgICAgICAgICAgIGluaXQpIHtcclxuICB2YXIgciA9IGluaXQ7XHJcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihrKSB7XHJcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBrKSkge1xyXG4gICAgICByID0gZihyLCBlbmNvZGluZ1trXSwgaywgIGVuY29kaW5nKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcjtcclxufVxyXG4iLCIvLyB1dGlsaXR5IGZvciBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XHJcblxyXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xyXG5pbXBvcnQge0Jpbn0gZnJvbSAnLi9zY2hlbWEvYmluLnNjaGVtYSc7XHJcblxyXG5pbXBvcnQge01BWEJJTlNfREVGQVVMVH0gZnJvbSAnLi9iaW4nO1xyXG5pbXBvcnQge0FHR1JFR0FURV9PUFN9IGZyb20gJy4vYWdncmVnYXRlJztcclxuaW1wb3J0IHtjb250YWlucywgZ2V0Ymluc30gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0ICogYXMgdGltZSBmcm9tICcuL2NvbXBpbGVyL3RpbWUnO1xyXG5pbXBvcnQge1RJTUVVTklUU30gZnJvbSAnLi90aW1ldW5pdCc7XHJcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTCwgU0hPUlRfVFlQRSwgVFlQRV9GUk9NX1NIT1JUX1RZUEV9IGZyb20gJy4vdHlwZSc7XHJcblxyXG5cclxuLy8gVE9ETyByZW1vdmUgdGhlc2UgXCJpc0RpbWVuc2lvbi9pc01lYXN1cmVcIiBzdHVmZlxyXG5mdW5jdGlvbiBfaXNGaWVsZERpbWVuc2lvbihmaWVsZERlZjogRmllbGREZWYpIHtcclxuICByZXR1cm4gIGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgfHwgISFmaWVsZERlZi5iaW4gfHxcclxuICAgIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiAhIWZpZWxkRGVmLnRpbWVVbml0ICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0RpbWVuc2lvbihmaWVsZERlZjogRmllbGREZWYpIHtcclxuICByZXR1cm4gZmllbGREZWYgJiYgX2lzRmllbGREaW1lbnNpb24oZmllbGREZWYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNNZWFzdXJlKGZpZWxkRGVmOiBGaWVsZERlZikge1xyXG4gIHJldHVybiBmaWVsZERlZiAmJiAhX2lzRmllbGREaW1lbnNpb24oZmllbGREZWYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY291bnQoKTogRmllbGREZWYge1xyXG4gIHJldHVybiB7ZmllbGQ6JyonLCBhZ2dyZWdhdGU6ICdjb3VudCcsIHR5cGU6IFFVQU5USVRBVElWRSwgZGlzcGxheU5hbWU6IENPVU5UX0RJU1BMQVlOQU1FfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENPVU5UX0RJU1BMQVlOQU1FID0gJ051bWJlciBvZiBSZWNvcmRzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZikge1xyXG4gIHJldHVybiBmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XHJcbn1cclxuXHJcbi8vIEZJWE1FIHJlbW92ZSB0aGlzLCBhbmQgdGhlIGdldGJpbnMgbWV0aG9kXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXJkaW5hbGl0eShmaWVsZERlZjogRmllbGREZWYsIHN0YXRzLCBmaWx0ZXJOdWxsID0ge30pIHtcclxuICAvLyBGSVhNRSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxyXG5cclxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkRGVmLmZpZWxkXTtcclxuICB2YXIgdHlwZSA9IGZpZWxkRGVmLnR5cGU7XHJcblxyXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcclxuICAgIC8vIG5lZWQgdG8gcmVhc3NpZ24gYmluLCBvdGhlcndpc2UgY29tcGlsYXRpb24gd2lsbCBmYWlsIGR1ZSB0byBhIFRTIGJ1Zy5cclxuICAgIGNvbnN0IGJpbiA9IGZpZWxkRGVmLmJpbjtcclxuICAgIGNvbnN0IG1heGJpbnMgPSAodHlwZW9mIGJpbiA9PT0gJ2Jvb2xlYW4nKSA/IE1BWEJJTlNfREVGQVVMVCA6IGJpbi5tYXhiaW5zO1xyXG5cclxuXHJcbiAgICB2YXIgYmlucyA9IGdldGJpbnMoc3RhdCwgbWF4Ymlucyk7XHJcbiAgICByZXR1cm4gKGJpbnMuc3RvcCAtIGJpbnMuc3RhcnQpIC8gYmlucy5zdGVwO1xyXG4gIH1cclxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcclxuICAgIHZhciBjYXJkaW5hbGl0eSA9IHRpbWUuY2FyZGluYWxpdHkoZmllbGREZWYsIHN0YXRzLCBmaWx0ZXJOdWxsLCB0eXBlKTtcclxuICAgIGlmKGNhcmRpbmFsaXR5ICE9PSBudWxsKSByZXR1cm4gY2FyZGluYWxpdHk7XHJcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcclxuICB9XHJcbiAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgbnVsbFxyXG4gIHJldHVybiBzdGF0LmRpc3RpbmN0IC1cclxuICAgIChzdGF0Lm1pc3NpbmcgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IEFSRUEgPSAnYXJlYSc7XHJcbmV4cG9ydCBjb25zdCBCQVIgPSAnYmFyJztcclxuZXhwb3J0IGNvbnN0IExJTkUgPSAnbGluZSc7XHJcbmV4cG9ydCBjb25zdCBQT0lOVCA9ICdwb2ludCc7XHJcbmV4cG9ydCBjb25zdCBURVhUID0gJ3RleHQnO1xyXG5leHBvcnQgY29uc3QgVElDSyA9ICd0aWNrJztcclxuXHJcbi8vIFRPRE86IGRlY2lkZSBpZiB3ZSB3YW50IHRvIGtlZXAgdGhlbT9cclxuZXhwb3J0IGNvbnN0IENJUkNMRSA9ICdjaXJjbGUnO1xyXG5leHBvcnQgY29uc3QgU1FVQVJFID0gJ3NxdWFyZSc7XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgQXhpcyB7XHJcbiAgLy8gVmVnYSBBeGlzIFByb3BlcnRpZXNcclxuICBmb3JtYXQ/OiBzdHJpbmc7XHJcbiAgZ3JpZD86IGJvb2xlYW47XHJcbiAgbGF5ZXI/OiBzdHJpbmc7XHJcbiAgb3JpZW50Pzogc3RyaW5nO1xyXG4gIHRpY2tzPzogbnVtYmVyO1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG4gIHRpY2tTaXplPzogbnVtYmVyO1xyXG4gIG9mZnNldD86IG51bWJlcjtcclxuICBzaG9ydFRpbWVOYW1lcz86IGJvb2xlYW47XHJcbiAgLy8gVmVnYS1MaXRlIG9ubHlcclxuICBsYWJlbE1heExlbmd0aD86IG51bWJlcjtcclxuICB0aXRsZU1heExlbmd0aD86IG51bWJlcjtcclxuICB0aXRsZU9mZnNldD86IG51bWJlcjtcclxuICBwcm9wZXJ0aWVzPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIFZnQXhpc1Byb3BlcnRpZXNcclxufVxyXG5cclxuZXhwb3J0IHZhciBheGlzID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIC8qIFZlZ2EgQXhpcyBQcm9wZXJ0aWVzICovXHJcbiAgICBmb3JtYXQ6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cclxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4gJytcclxuICAgICAgICAgICAgICAgICAgICdJZiBub3QgdW5kZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSAnICtcclxuICAgICAgICAgICAgICAgICAgICd0aGUgbWF4IHZhbHVlICcgK1xyXG4gICAgICAgICAgICAgICAgICAgJ29mIHRoZSBmaWVsZC4nXHJcbiAgICB9LFxyXG4gICAgZ3JpZDoge1xyXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcclxuICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3IgUk9XIGFuZCBDT0wuIEZvciBYIGFuZCBZLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIHF1YW50aXRhdGl2ZSBhbmQgdGltZSBmaWVsZHMgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLidcclxuICAgIH0sXHJcbiAgICBsYXllcjoge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGluZGljYXRpbmcgaWYgdGhlIGF4aXMgKGFuZCBhbnkgZ3JpZGxpbmVzKSBzaG91bGQgYmUgcGxhY2VkIGFib3ZlIG9yIGJlbG93IHRoZSBkYXRhIG1hcmtzLidcclxuICAgIH0sXHJcbiAgICBvcmllbnQ6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcclxuICAgICAgZW51bTogWyd0b3AnLCAncmlnaHQnLCAnbGVmdCcsICdib3R0b20nXSxcclxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGF4aXMuIE9uZSBvZiB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodC4gVGhlIG9yaWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIGZ1cnRoZXIgc3BlY2lhbGl6ZSB0aGUgYXhpcyB0eXBlIChlLmcuLCBhIHkgYXhpcyBvcmllbnRlZCBmb3IgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGNoYXJ0KS4nXHJcbiAgICB9LFxyXG4gICAgdGlja3M6IHtcclxuICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIG1pbmltdW06IDAsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBkZXNpcmVkIG51bWJlciBvZiB0aWNrcywgZm9yIGF4ZXMgdmlzdWFsaXppbmcgcXVhbnRpdGF0aXZlIHNjYWxlcy4gVGhlIHJlc3VsdGluZyBudW1iZXIgbWF5IGJlIGRpZmZlcmVudCBzbyB0aGF0IHZhbHVlcyBhcmUgXCJuaWNlXCIgKG11bHRpcGxlcyBvZiAyLCA1LCAxMCkgYW5kIGxpZSB3aXRoaW4gdGhlIHVuZGVybHlpbmcgc2NhbGVcXCdzIHJhbmdlLidcclxuICAgIH0sXHJcbiAgICAvKiBWZWdhIEF4aXMgUHJvcGVydGllcyB0aGF0IGFyZSBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlZCBieSBWZWdhLWxpdGUgKi9cclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBmb3IgdGhlIGF4aXMuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xyXG4gICAgfSxcclxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5ICovXHJcbiAgICBsYWJlbE1heExlbmd0aDoge1xyXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgIGRlZmF1bHQ6IDI1LFxyXG4gICAgICBtaW5pbXVtOiAwLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXHJcbiAgICB9LFxyXG4gICAgdGl0bGVNYXhMZW5ndGg6IHtcclxuICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIG1pbmltdW06IDAsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4IGxlbmd0aCBmb3IgYXhpcyB0aXRsZSBpZiB0aGUgdGl0bGUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGUgZmllbGRcXCdzIGRlc2NyaXB0aW9uJ1xyXG4gICAgfSxcclxuICAgIHRpdGxlT2Zmc2V0OiB7XHJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXHJcbiAgICB9LFxyXG4gICAgc2hvcnRUaW1lTmFtZXM6IHtcclxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIG1vbnRoIG5hbWVzIGFuZCB3ZWVrZGF5IG5hbWVzIHNob3VsZCBiZSBhYmJyZXZpYXRlZC4nXHJcbiAgICB9LFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ09wdGlvbmFsIG1hcmsgcHJvcGVydHkgZGVmaW5pdGlvbnMgZm9yIGN1c3RvbSBheGlzIHN0eWxpbmcuJ1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtNQVhCSU5TX0RFRkFVTFR9IGZyb20gJy4uL2Jpbic7XHJcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcclxuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi4vdXRpbCc7XHJcblxyXG4vLyBUT0RPOiBhZGQgb3RoZXIgYmluIHByb3BlcnRpZXNcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmluIHtcclxuICBtYXhiaW5zOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgYmluID0ge1xyXG4gIHR5cGU6IFsnYm9vbGVhbicsICdvYmplY3QnXSxcclxuICBkZWZhdWx0OiBmYWxzZSxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBtYXhiaW5zOiB7XHJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcclxuICAgICAgZGVmYXVsdDogTUFYQklOU19ERUZBVUxULFxyXG4gICAgICBtaW5pbXVtOiAyLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ01heGltdW0gbnVtYmVyIG9mIGJpbnMuJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkVdKSAvLyBUT0RPOiBhZGQgTyBhZnRlciBmaW5pc2hpbmcgIzgxXHJcbn07XHJcbiIsIi8vIFRPRE86IGFkZCBpbnRlcmZhY2UgQ29uZmlnXHJcblxyXG5leHBvcnQgdmFyIGNvbmZpZyA9IHtcclxuICB0eXBlOiAnb2JqZWN0JyxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAvLyB0ZW1wbGF0ZVxyXG4gICAgd2lkdGg6IHtcclxuICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB2aWV3cG9ydDoge1xyXG4gICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICBpdGVtczoge1xyXG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZmlsdGVyIG51bGxcclxuICAgIC8vIFRPRE8oIzU5NykgcmV2aXNlIHRoaXMgY29uZmlnXHJcbiAgICBmaWx0ZXJOdWxsOiB7XHJcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgbm9taW5hbDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXHJcbiAgICAgICAgb3JkaW5hbDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXHJcbiAgICAgICAgcXVhbnRpdGF0aXZlOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IHRydWV9LFxyXG4gICAgICAgIHRlbXBvcmFsOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IHRydWV9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gc21hbGwgbXVsdGlwbGVzXHJcbiAgICB0ZXh0Q2VsbFdpZHRoOiB7XHJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcclxuICAgICAgZGVmYXVsdDogOTAsXHJcbiAgICAgIG1pbmltdW06IDBcclxuICAgIH0sXHJcblxyXG4gICAgLy8gbGF5b3V0XHJcbiAgICAvLyBUT0RPOiBhZGQgb3JpZW50XHJcbiAgICBzb3J0TGluZUJ5OiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0YSBmaWVsZCB0byBzb3J0IGxpbmUgYnkuICcgK1xyXG4gICAgICAgICdcXCctXFwnIHByZWZpeCBjYW4gYmUgYWRkZWQgdG8gc3VnZ2VzdCBkZXNjZW5kaW5nIG9yZGVyLidcclxuICAgIH0sXHJcbiAgICBzdGFjazoge1xyXG4gICAgICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXHJcbiAgICAgIGRlZmF1bHQ6IHt9LFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBzdGFja2luZyAoZm9yIGJhciBhbmQgYXJlYSBtYXJrcyBvbmx5KS4nLFxyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgc29ydDoge1xyXG4gICAgICAgICAgb25lT2Y6IFt7XHJcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICBlbnVtOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJ11cclxuICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICAgICAgICBpdGVtczoge3R5cGU6ICdzdHJpbmcnfSxcclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdPcmRlciBvZiB0aGUgc3RhY2suICcgK1xyXG4gICAgICAgICAgICAnVGhpcyBjYW4gYmUgZWl0aGVyIGEgc3RyaW5nIChlaXRoZXIgXCJkZXNjZW5kaW5nXCIgb3IgXCJhc2NlbmRpbmdcIiknICtcclxuICAgICAgICAgICAgJ29yIGEgbGlzdCBvZiBmaWVsZHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiBzdGFjayBsYXllcnMuJyArXHJcbiAgICAgICAgICAgICdCeSBkZWZhdWx0LCBzdGFjayB1c2VzIGRlc2NlbmRpbmcgb3JkZXIuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb2Zmc2V0OiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGVudW06IFsnemVybycsICdjZW50ZXInLCAnbm9ybWFsaXplJ11cclxuICAgICAgICAgIC8vIFRPRE8oIzYyMCkgcmVmZXIgdG8gVmVnYSBzcGVjIG9uY2UgaXQgZG9lc24ndCB0aHJvdyBlcnJvclxyXG4gICAgICAgICAgLy8gZW51bTogdmdTdGFja1NjaGVtYS5wcm9wZXJ0aWVzLm9mZnNldC5vbmVPZlswXS5lbnVtXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gY2VsbFxyXG4gICAgY2VsbDoge1xyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHdpZHRoOiB7XHJcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgICBkZWZhdWx0OiAyMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhlaWdodDoge1xyXG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgICAgZGVmYXVsdDogMjAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYWRkaW5nOiB7XHJcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgICBkZWZhdWx0OiAxNixcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZGVmYXVsdCBwYWRkaW5nIGJldHdlZW4gZmFjZXRzLidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyaWRDb2xvcjoge1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICByb2xlOiAnY29sb3InLFxyXG4gICAgICAgICAgZGVmYXVsdDogJyMwMDAwMDAnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmlkT3BhY2l0eToge1xyXG4gICAgICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgICAgICBtaW5pbXVtOiAwLFxyXG4gICAgICAgICAgbWF4aW11bTogMSxcclxuICAgICAgICAgIGRlZmF1bHQ6IDAuMjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyaWRPZmZzZXQ6IHtcclxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgZGVmYXVsdDogNiAvLyBlcXVhbCB0byB0aWNrU2l6ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlsbDoge1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICByb2xlOiAnY29sb3InLFxyXG4gICAgICAgICAgZGVmYXVsdDogJ3JnYmEoMCwwLDAsMCknXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaWxsT3BhY2l0eToge1xyXG4gICAgICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgcm9sZTogJ2NvbG9yJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZVdpZHRoOiB7XHJcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHtcclxuICAgICAgICAgIHR5cGU6ICdudW1iZXInXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2VEYXNoOiB7XHJcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxyXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XHJcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYXJrczoge1xyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIFZlZ2EtTGl0ZSBzcGVjaWFsXHJcbiAgICAgICAgZmlsbGVkOiB7XHJcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0aGUgc2hhcGVcXCdzIGNvbG9yIHNob3VsZCBiZSB1c2VkIGFzIGZpbGwgY29sb3IgaW5zdGVhZCBvZiBzdHJva2UgY29sb3IuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGRlZmF1bHQ6ICcnLCAgLy8gYXV0b1xyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciB0ZXh0IHZhbHVlLicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ0lmIG5vdCBkZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBhdXRvbWF0aWNhbGx5J1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEdlbmVyYWwgVmVnYVxyXG4gICAgICAgIG9wYWNpdHk6IHtcclxuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xyXG4gICAgICAgICAgbWluaW11bTogMCxcclxuICAgICAgICAgIG1heGltdW06IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZVdpZHRoOiB7XHJcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgICBkZWZhdWx0OiAyLFxyXG4gICAgICAgICAgbWluaW11bTogMFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHRleHQtb25seVxyXG4gICAgICAgIGFsaWduOiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGRlZmF1bHQ6ICdyaWdodCcsXHJcbiAgICAgICAgICBlbnVtOiBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ10sXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBob3Jpem9udGFsIGFsaWdubWVudCBvZiB0aGUgdGV4dC4gT25lIG9mIGxlZnQsIHJpZ2h0LCBjZW50ZXIuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmFzZWxpbmU6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgZGVmYXVsdDogJ21pZGRsZScsXHJcbiAgICAgICAgICBlbnVtOiBbJ3RvcCcsICdtaWRkbGUnLCAnYm90dG9tJ10sXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQuIE9uZSBvZiB0b3AsIG1pZGRsZSwgYm90dG9tLidcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFRPRE8gZHgsIGR5LCByYWRpdXMsIHRoZXRhLCBhbmdsZVxyXG4gICAgICAgIGZpbGw6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgcm9sZTogJ2NvbG9yJyxcclxuICAgICAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICByb2xlOiAnZm9udCcsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSB0eXBlZmFjZSB0byBzZXQgdGhlIHRleHQgaW4gKGUuZy4sIEhlbHZldGljYSBOZXVlKS4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb250U2l6ZToge1xyXG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgbWluaW11bTogMCxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvbnQgc2l6ZSwgaW4gcGl4ZWxzLidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbnRTdHlsZToge1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXSxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvbnQgc3R5bGUgKGUuZy4sIGl0YWxpYykuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9udFdlaWdodDoge1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXHJcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHdlaWdodCAoZS5nLiwgYm9sZCkuJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBGSVhNRSByZW1vdmUgdGhpcyBcclxuICAgIHNpbmdsZUJhck9mZnNldDoge1xyXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgIGRlZmF1bHQ6IDUsXHJcbiAgICAgIG1pbmltdW06IDBcclxuICAgIH0sXHJcbiAgICAvLyBvdGhlclxyXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcclxuICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICBkZWZhdWx0OiA2XHJcbiAgICB9LFxyXG4gICAgLy8gRklYTUUoIzQ5NykgaGFuZGxlIHRoaXNcclxuICAgIG51bWJlckZvcm1hdDoge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgZGVmYXVsdDogJ3MnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcy4nXHJcbiAgICB9LFxyXG4gICAgLy8gRklYTUUoIzQ5NykgaGFuZGxlIHRoaXNcclxuICAgIHRpbWVGb3JtYXQ6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICclWS0lbS0lZCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0ZSBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzLidcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgRGF0YSB7XHJcbiAgZm9ybWF0VHlwZT86IHN0cmluZztcclxuICB1cmw/OiBzdHJpbmc7XHJcbiAgdmFsdWVzPzogYW55W107XHJcbiAgZmlsdGVyPzogc3RyaW5nO1xyXG4gIGNhbGN1bGF0ZT86IFZnRm9ybXVsYVtdO1xyXG59XHJcblxyXG4vLyBUT0RPIG1vdmUgdGhpcyB0byBvbmUgY2VudHJhbCBwb3NpdGlvblxyXG5leHBvcnQgaW50ZXJmYWNlIFZnRm9ybXVsYSB7XHJcbiAgZmllbGQ6IHN0cmluZztcclxuICBleHByOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgZGF0YSA9IHtcclxuICB0eXBlOiAnb2JqZWN0JyxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAvLyBkYXRhIHNvdXJjZVxyXG4gICAgZm9ybWF0VHlwZToge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgZW51bTogWydqc29uJywgJ2NzdicsICd0c3YnXSxcclxuICAgICAgZGVmYXVsdDogJ2pzb24nXHJcbiAgICB9LFxyXG4gICAgdXJsOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB2YWx1ZXM6IHtcclxuICAgICAgdHlwZTogJ2FycmF5JyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxyXG4gICAgICBpdGVtczoge1xyXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyB3ZSBnZW5lcmF0ZSBhIHZlZ2EgZmlsdGVyIHRyYW5zZm9ybVxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgY29udGFpbmluZyB0aGUgZmlsdGVyIFZlZ2EgZXhwcmVzc2lvbi4gVXNlIGBkYXR1bWAgdG8gcmVmZXIgdG8gdGhlIGN1cnJlbnQgZGF0YSBvYmplY3QuJ1xyXG4gICAgfSxcclxuICAgIC8vIHdlIGdlbmVyYXRlIGEgdmVnYSBmb3JtdWxhIHRyYW5zZm9ybVxyXG4gICAgY2FsY3VsYXRlOiB7XHJcbiAgICAgIHR5cGU6ICdhcnJheScsXHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcclxuICAgICAgZGVzY3JpcHRpb246ICdDYWxjdWxhdGUgbmV3IGZpZWxkKHMpIHVzaW5nIHRoZSBwcm92aWRlZCBleHByZXNzc2lvbihzKS4gQ2FsY3VsYXRpb24gYXJlIGFwcGxpZWQgYmVmb3JlIGZpbHRlci4nLFxyXG4gICAgICBpdGVtczoge1xyXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgIGZpZWxkOiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmaWVsZCBpbiB3aGljaCB0byBzdG9yZSB0aGUgY29tcHV0ZWQgZm9ybXVsYSB2YWx1ZS4nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXhwcjoge1xyXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBIHN0cmluZyBjb250YWluaW5nIGFuIGV4cHJlc3Npb24gZm9yIHRoZSBmb3JtdWxhLiBVc2UgdGhlIHZhcmlhYmxlIGBkYXR1bWAgdG8gdG8gcmVmZXIgdG8gdGhlIGN1cnJlbnQgZGF0YSBvYmplY3QuJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHttZXJnZX0gZnJvbSAnLi9zY2hlbWF1dGlsJztcclxuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xyXG5pbXBvcnQgKiBhcyB2bFV0aWwgZnJvbSAnLi4vdXRpbCc7XHJcblxyXG5cclxuaW1wb3J0IHtheGlzfSBmcm9tICcuL2F4aXMuc2NoZW1hJztcclxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xyXG5pbXBvcnQge2xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQuc2NoZW1hJztcclxuaW1wb3J0IHtzb3J0fSBmcm9tICcuL3NvcnQuc2NoZW1hJztcclxuaW1wb3J0IHt0eXBpY2FsRmllbGQsIG9ubHlPcmRpbmFsRmllbGR9IGZyb20gJy4vZmllbGRkZWYuc2NoZW1hJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW5jb2Rpbmcge1xyXG4gIHg/OiBGaWVsZERlZjtcclxuICB5PzogRmllbGREZWY7XHJcbiAgcm93PzogRmllbGREZWY7XHJcbiAgY29sdW1uPzogRmllbGREZWY7XHJcbiAgY29sb3I/OiBGaWVsZERlZjtcclxuICBzaXplPzogRmllbGREZWY7XHJcbiAgc2hhcGU/OiBGaWVsZERlZjtcclxuICBkZXRhaWw/OiBGaWVsZERlZjtcclxuICB0ZXh0PzogRmllbGREZWY7XHJcbn1cclxuXHJcbi8vIFRPRE86IHJlbW92ZSBpZiBwb3NzaWJsZVxyXG52YXIgcmVxdWlyZWROYW1lVHlwZSA9IHtcclxuICByZXF1aXJlZDogWydmaWVsZCcsICd0eXBlJ11cclxufTtcclxuXHJcbnZhciB4ID0gbWVyZ2UoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHJlcXVpcmVkTmFtZVR5cGUsIHtcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBzY2FsZTogey8vIHJlcGxhY2luZyBkZWZhdWx0IHZhbHVlcyBmb3IganVzdCB0aGVzZSB0d28gYXhlc1xyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGFkZGluZzoge2RlZmF1bHQ6IDF9LFxyXG4gICAgICAgIGJhbmRXaWR0aDoge2RlZmF1bHQ6IDIxfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXhpczogYXhpcyxcclxuICAgIHNvcnQ6IHNvcnRcclxuICB9XHJcbn0pO1xyXG5cclxudmFyIHkgPSBkdXBsaWNhdGUoeCk7XHJcblxyXG52YXIgZmFjZXQgPSBtZXJnZShkdXBsaWNhdGUob25seU9yZGluYWxGaWVsZCksIHJlcXVpcmVkTmFtZVR5cGUsIHtcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBheGlzOiBheGlzLFxyXG4gICAgc29ydDogc29ydFxyXG4gIH1cclxufSk7XHJcblxyXG52YXIgcm93ID0gbWVyZ2UoZHVwbGljYXRlKGZhY2V0KSk7XHJcbnZhciBjb2x1bW4gPSBtZXJnZShkdXBsaWNhdGUoZmFjZXQpKTtcclxuXHJcbnZhciBzaXplID0gbWVyZ2UoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHtcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBsZWdlbmQ6IGxlZ2VuZCxcclxuICAgIHNvcnQ6IHNvcnQsXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgIGRlZmF1bHQ6IDMwLFxyXG4gICAgICBtaW5pbXVtOiAwLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NpemUgb2YgbWFya3MuJ1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG52YXIgY29sb3IgPSBtZXJnZShkdXBsaWNhdGUodHlwaWNhbEZpZWxkKSwge1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGxlZ2VuZDogbGVnZW5kLFxyXG4gICAgc29ydDogc29ydCxcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICByb2xlOiAnY29sb3InLFxyXG4gICAgICBkZWZhdWx0OiAnIzQ2ODJiNCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29sb3IgdG8gYmUgdXNlZCBmb3IgbWFya3MuJ1xyXG4gICAgfSxcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcXVhbnRpdGF0aXZlUmFuZ2U6IHtcclxuICAgICAgICAgIHR5cGU6ICdhcnJheScsXHJcbiAgICAgICAgICBkZWZhdWx0OiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddLCAvLyB0YWJsZWF1IGdyZWVuc1xyXG4gICAgICAgICAgLy8gZGVmYXVsdDogWycjY2NlY2U2JywgJyMwMDQ0MWInXSwgLy8gQnVHbi45IFsyLThdXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbG9yIHJhbmdlIHRvIGVuY29kZSBxdWFudGl0YXRpdmUgdmFyaWFibGVzLicsXHJcbiAgICAgICAgICBtaW5JdGVtczogMixcclxuICAgICAgICAgIG1heEl0ZW1zOiAyLFxyXG4gICAgICAgICAgaXRlbXM6IHtcclxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgIHJvbGU6ICdjb2xvcidcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxudmFyIHNoYXBlID0gbWVyZ2UoZHVwbGljYXRlKG9ubHlPcmRpbmFsRmllbGQpLCB7XHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgbGVnZW5kOiBsZWdlbmQsXHJcbiAgICBzb3J0OiBzb3J0LFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcclxuICAgICAgZGVmYXVsdDogJ2NpcmNsZScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFyayB0byBiZSB1c2VkLidcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxudmFyIGRldGFpbCA9IG1lcmdlKGR1cGxpY2F0ZShvbmx5T3JkaW5hbEZpZWxkKSwge1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIHNvcnQ6IHNvcnRcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gd2Ugb25seSBwdXQgYWdncmVnYXRlZCBtZWFzdXJlIGluIHBpdm90IHRhYmxlXHJcbnZhciB0ZXh0ID0gbWVyZ2UoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHtcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBzb3J0OiBzb3J0LFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICdBYmMnXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCB2YXIgZW5jb2RpbmcgPSB7XHJcbiAgdHlwZTogJ29iamVjdCcsXHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgeDogeCxcclxuICAgIHk6IHksXHJcbiAgICByb3c6IHJvdyxcclxuICAgIGNvbHVtbjogY29sdW1uLFxyXG4gICAgc2l6ZTogc2l6ZSxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIHNoYXBlOiBzaGFwZSxcclxuICAgIHRleHQ6IHRleHQsXHJcbiAgICBkZXRhaWw6IGRldGFpbFxyXG4gIH1cclxufTtcclxuIiwiaW1wb3J0IHtBeGlzfSBmcm9tICcuL2F4aXMuc2NoZW1hJztcclxuaW1wb3J0IHtiaW4sIEJpbn0gZnJvbSAnLi9iaW4uc2NoZW1hJztcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kLnNjaGVtYSc7XHJcbmltcG9ydCB7dHlwaWNhbFNjYWxlLCBvcmRpbmFsT25seVNjYWxlLCBTY2FsZX0gZnJvbSAnLi9zY2FsZS5zY2hlbWEnO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydC5zY2hlbWEnO1xyXG5cclxuaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xyXG5pbXBvcnQge3RvTWFwLCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xyXG5pbXBvcnQge21lcmdlfSBmcm9tICcuL3NjaGVtYXV0aWwnO1xyXG5pbXBvcnQge1RJTUVVTklUU30gZnJvbSAnLi4vdGltZXVuaXQnO1xyXG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZiB7XHJcbiAgZmllbGQ/OiBzdHJpbmc7XHJcbiAgdHlwZT86IHN0cmluZztcclxuICB2YWx1ZT86IGFueTtcclxuXHJcbiAgLy8gZnVuY3Rpb25cclxuICBhZ2dyZWdhdGU/OiBzdHJpbmc7XHJcbiAgdGltZVVuaXQ/OiBzdHJpbmc7XHJcbiAgYmluPzogYm9vbGVhbiB8IEJpbjtcclxuXHJcbiAgc29ydD86IFNvcnQgfCBzdHJpbmc7XHJcblxyXG4gIC8vIG92ZXJyaWRlIHZlZ2EgY29tcG9uZW50c1xyXG4gIGF4aXM/OiBBeGlzO1xyXG4gIGxlZ2VuZD86IExlZ2VuZCB8IGJvb2xlYW47XHJcbiAgc2NhbGU/OiBTY2FsZTtcclxuXHJcbiAgLy8gdGV4dFxyXG4gIGFsaWduPzogc3RyaW5nO1xyXG4gIGJhc2VsaW5lPzogc3RyaW5nO1xyXG4gIGNvbG9yPzogc3RyaW5nO1xyXG4gIG1hcmdpbj86IG51bWJlcjtcclxuICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxuICBmb250PzogYW55OyAvLyBkZWNsYXJlIGZvbnRcclxuICBmb3JtYXQ/OiBzdHJpbmc7XHJcbiAgZm9udFNpemU/OiBudW1iZXI7XHJcblxyXG4gIC8vIFRPRE86IG1vdmUgdG8gY29uZmlnXHJcbiAgZmlsbGVkPzogYm9vbGVhbjtcclxuICBvcGFjaXR5PzogbnVtYmVyO1xyXG5cclxuICAvLyBUT0RPOiBtYXliZSBleHRlbmQgdGhpcyBpbiBvdGhlciBhcHA/XHJcbiAgLy8gdW51c2VkIG1ldGFkYXRhIC0tIGZvciBvdGhlciBhcHBsaWNhdGlvblxyXG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIGZpZWxkRGVmID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGZpZWxkOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICB9LFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgZW51bTogW05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUxdXHJcbiAgICB9LFxyXG4gICAgdGltZVVuaXQ6IHtcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGVudW06IFRJTUVVTklUUyxcclxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtURU1QT1JBTF0pXHJcbiAgICB9LFxyXG4gICAgYmluOiBiaW4sXHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHZhciBhZ2dyZWdhdGUgPSB7XHJcbiAgdHlwZTogJ3N0cmluZycsXHJcbiAgZW51bTogQUdHUkVHQVRFX09QUyxcclxuICBzdXBwb3J0ZWRFbnVtczoge1xyXG4gICAgcXVhbnRpdGF0aXZlOiBBR0dSRUdBVEVfT1BTLFxyXG4gICAgb3JkaW5hbDogWydtZWRpYW4nLCdtaW4nLCdtYXgnXSxcclxuICAgIG5vbWluYWw6IFtdLFxyXG4gICAgdGVtcG9yYWw6IFsnbWVhbicsICdtZWRpYW4nLCAnbWluJywgJ21heCddLCAvLyBUT0RPOiByZXZpc2Ugd2hhdCBzaG91bGQgdGltZSBzdXBwb3J0XHJcbiAgICAnJzogWydjb3VudCddXHJcbiAgfSxcclxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgTk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUwsICcnXSlcclxufTtcclxuXHJcbmV4cG9ydCB2YXIgdHlwaWNhbEZpZWxkID0gbWVyZ2UoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGFnZ3JlZ2F0ZTogYWdncmVnYXRlLFxyXG4gICAgc2NhbGU6IHR5cGljYWxTY2FsZVxyXG4gIH1cclxufSk7XHJcblxyXG5leHBvcnQgdmFyIG9ubHlPcmRpbmFsRmllbGQgPSBtZXJnZShkdXBsaWNhdGUoZmllbGREZWYpLCB7XHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgYWdncmVnYXRlOiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBlbnVtOiBbJ2NvdW50J10sXHJcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbTk9NSU5BTCwgT1JESU5BTF0pXHJcbiAgICB9LFxyXG4gICAgc2NhbGU6IG9yZGluYWxPbmx5U2NhbGVcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQge2lzT2JqZWN0fSBmcm9tICcuLi91dGlsJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGVnZW5kIHtcclxuICBvcmllbnQ/OiBzdHJpbmc7XHJcbiAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgZm9ybWF0Pzogc3RyaW5nO1xyXG4gIHZhbHVlcz86IEFycmF5PGFueT47XHJcbiAgcHJvcGVydGllcz86IGFueTsgLy9UT0RPIGRlY2xhcmUgVmdMZWdlbmRQcm9wZXJ0aWVzXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgbGVnZW5kID0ge1xyXG4gIGRlZmF1bHQ6IHRydWUsXHJcbiAgZGVzY3JpcHRpb246ICdQcm9wZXJ0aWVzIG9mIGEgbGVnZW5kIG9yIGJvb2xlYW4gZmxhZyBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciB0byBzaG93IGl0LicsXHJcbiAgb25lT2Y6IFt7XHJcbiAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgb3JpZW50OiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBsZWdlbmQuIE9uZSBvZiBcImxlZnRcIiBvciBcInJpZ2h0XCIuIFRoaXMgZGV0ZXJtaW5lcyBob3cgdGhlIGxlZ2VuZCBpcyBwb3NpdGlvbmVkIHdpdGhpbiB0aGUgc2NlbmUuIFRoZSBkZWZhdWx0IGlzIFwicmlnaHRcIi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBmb3IgdGhlIGxlZ2VuZC4gKFNob3dzIGZpZWxkIG5hbWUgYW5kIGl0cyBmdW5jdGlvbiBieSBkZWZhdWx0LiknXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FuIG9wdGlvbmFsIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgbGVnZW5kIGxhYmVscy4gVmVnYSB1c2VzIEQzXFwncyBmb3JtYXQgcGF0dGVybi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHZhbHVlczoge1xyXG4gICAgICAgIHR5cGU6ICdhcnJheScsXHJcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRXhwbGljaXRseSBzZXQgdGhlIHZpc2libGUgbGVnZW5kIHZhbHVlcy4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdPcHRpb25hbCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb25zIGZvciBjdXN0b20gbGVnZW5kIHN0eWxpbmcuICdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gIH1dXHJcbn07XHJcbiIsImV4cG9ydCB2YXIgbWFya3R5cGUgPSB7XHJcbiAgdHlwZTogJ3N0cmluZycsXHJcbiAgZW51bTogWydwb2ludCcsICd0aWNrJywgJ2JhcicsICdsaW5lJywgJ2FyZWEnLCAnY2lyY2xlJywgJ3NxdWFyZScsICd0ZXh0J11cclxufTtcclxuIiwiaW1wb3J0IHt0b01hcCwgZHVwbGljYXRlIGFzIGNsb25lfSBmcm9tICcuLi91dGlsJztcclxuaW1wb3J0IHttZXJnZX0gZnJvbSAnLi9zY2hlbWF1dGlsJztcclxuaW1wb3J0IHtRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGUge1xyXG4gIHR5cGU/OiBzdHJpbmc7XHJcbiAgZG9tYWluPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnRGF0YURvbWFpblxyXG4gIHJhbmdlPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnUmFuZ2VEb21haW5cclxuICByb3VuZD86IGJvb2xlYW47XHJcblxyXG4gIC8vIG9yZGluYWxcclxuICBiYW5kV2lkdGg/OiBudW1iZXI7XHJcbiAgb3V0ZXJQYWRkaW5nPzogbnVtYmVyO1xyXG4gIHBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcG9pbnRzPzogYm9vbGVhbjtcclxuXHJcbiAgLy8gdHlwaWNhbFxyXG4gIGNsYW1wPzogYm9vbGVhbjtcclxuICBuaWNlPzogYm9vbGVhbnxzdHJpbmc7XHJcbiAgZXhwb25lbnQ/OiBudW1iZXI7XHJcbiAgemVybz86IGJvb2xlYW47XHJcblxyXG4gIC8vIFZlZ2EtTGl0ZSBvbmx5XHJcbiAgdXNlUmF3RG9tYWluPzogYm9vbGVhbjtcclxufVxyXG5cclxudmFyIHNjYWxlID0ge1xyXG4gIHR5cGU6ICdvYmplY3QnLFxyXG4gIC8vIFRPRE86IHJlZmVyIHRvIFZlZ2EncyBzY2FsZSBzY2hlbWFcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAvKiBDb21tb24gU2NhbGUgUHJvcGVydGllcyAqL1xyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgLy8gVE9ETyhrYW5pdHcpIHJlYWQgdmVnYSdzIHNjaGVtYSBoZXJlLCBhZGQgZGVzY3JpcHRpb25cclxuICAgICAgZW51bTogWydsaW5lYXInLCAnbG9nJywgJ3BvdycsICdzcXJ0JywgJ3F1YW50aWxlJ10sXHJcbiAgICAgIGRlZmF1bHQ6ICdsaW5lYXInLFxyXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRV0pXHJcbiAgICB9LFxyXG4gICAgZG9tYWluOiB7XHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcclxuICAgICAgdHlwZTogWydhcnJheScsICdvYmplY3QnXSxcclxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZG9tYWluIG9mIHRoZSBzY2FsZSwgcmVwcmVzZW50aW5nIHRoZSBzZXQgb2YgZGF0YSB2YWx1ZXMuIEZvciBxdWFudGl0YXRpdmUgZGF0YSwgdGhpcyBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsL2NhdGVnb3JpY2FsIGRhdGEsIHRoaXMgbWF5IGJlIGFuIGFycmF5IG9mIHZhbGlkIGlucHV0IHZhbHVlcy4gVGhlIGRvbWFpbiBtYXkgYWxzbyBiZSBzcGVjaWZpZWQgYnkgYSByZWZlcmVuY2UgdG8gYSBkYXRhIHNvdXJjZS4nXHJcbiAgICB9LFxyXG4gICAgcmFuZ2U6IHtcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICB0eXBlOiBbJ2FycmF5JywgJ29iamVjdCcsICdzdHJpbmcnXSxcclxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcmFuZ2Ugb2YgdGhlIHNjYWxlLCByZXByZXNlbnRpbmcgdGhlIHNldCBvZiB2aXN1YWwgdmFsdWVzLiBGb3IgbnVtZXJpYyB2YWx1ZXMsIHRoZSByYW5nZSBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsIG9yIHF1YW50aXplZCBkYXRhLCB0aGUgcmFuZ2UgbWF5IGJ5IGFuIGFycmF5IG9mIGRlc2lyZWQgb3V0cHV0IHZhbHVlcywgd2hpY2ggYXJlIG1hcHBlZCB0byBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGRvbWFpbi4gRm9yIG9yZGluYWwgc2NhbGVzIG9ubHksIHRoZSByYW5nZSBjYW4gYmUgZGVmaW5lZCB1c2luZyBhIERhdGFSZWY6IHRoZSByYW5nZSB2YWx1ZXMgYXJlIHRoZW4gZHJhd24gZHluYW1pY2FsbHkgZnJvbSBhIGJhY2tpbmcgZGF0YSBzZXQuJ1xyXG4gICAgfSxcclxuICAgIHJvdW5kOiB7XHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgLy8gVE9ETzogcmV2aXNlIGRlZmF1bHRcclxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIHJvdW5kcyBudW1lcmljIG91dHB1dCB2YWx1ZXMgdG8gaW50ZWdlcnMuIFRoaXMgY2FuIGJlIGhlbHBmdWwgZm9yIHNuYXBwaW5nIHRvIHRoZSBwaXhlbCBncmlkLidcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5cclxudmFyIG9yZGluYWxTY2FsZU1peGluID0ge1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGJhbmRXaWR0aDoge1xyXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXHJcbiAgICAgIG1pbmltdW06IDAsXHJcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgfSxcclxuICAgIC8qIE9yZGluYWwgU2NhbGUgUHJvcGVydGllcyAqL1xyXG4gICAgb3V0ZXJQYWRkaW5nOiB7XHJcbiAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgLy8gVE9ETzogYWRkIGRlc2NyaXB0aW9uIG9uY2UgaXQgaXMgZG9jdW1lbnRlZCBpbiBWZWdhXHJcbiAgICB9LFxyXG4gICAgcGFkZGluZzoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0FwcGxpZXMgc3BhY2luZyBhbW9uZyBvcmRpbmFsIGVsZW1lbnRzIGluIHRoZSBzY2FsZSByYW5nZS4gVGhlIGFjdHVhbCBlZmZlY3QgZGVwZW5kcyBvbiBob3cgdGhlIHNjYWxlIGlzIGNvbmZpZ3VyZWQuIElmIHRoZSBfX3BvaW50c19fIHBhcmFtZXRlciBpcyBgdHJ1ZWAsIHRoZSBwYWRkaW5nIHZhbHVlIGlzIGludGVycHJldGVkIGFzIGEgbXVsdGlwbGUgb2YgdGhlIHNwYWNpbmcgYmV0d2VlbiBwb2ludHMuIEEgcmVhc29uYWJsZSB2YWx1ZSBpcyAxLjAsIHN1Y2ggdGhhdCB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnQgd2lsbCBiZSBvZmZzZXQgZnJvbSB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZSBieSBoYWxmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cy4gT3RoZXJ3aXNlLCBwYWRkaW5nIGlzIHR5cGljYWxseSBpbiB0aGUgcmFuZ2UgWzAsIDFdIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgZnJhY3Rpb24gb2Ygc3BhY2UgaW4gdGhlIHJhbmdlIGludGVydmFsIHRvIGFsbG9jYXRlIHRvIHBhZGRpbmcuIEEgdmFsdWUgb2YgMC41IG1lYW5zIHRoYXQgdGhlIHJhbmdlIGJhbmQgd2lkdGggd2lsbCBiZSBlcXVhbCB0byB0aGUgcGFkZGluZyB3aWR0aC4gRm9yIG1vcmUsIHNlZSB0aGUgW0QzIG9yZGluYWwgc2NhbGUgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL21ib3N0b2NrL2QzL3dpa2kvT3JkaW5hbC1TY2FsZXMpLidcclxuICAgICAgICB9LFxyXG4gICAgcG9pbnRzOiB7XHJcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIGRpc3RyaWJ1dGVzIHRoZSBvcmRpbmFsIHZhbHVlcyBvdmVyIGEgcXVhbnRpdGF0aXZlIHJhbmdlIGF0IHVuaWZvcm1seSBzcGFjZWQgcG9pbnRzLiBUaGUgc3BhY2luZyBvZiB0aGUgcG9pbnRzIGNhbiBiZSBhZGp1c3RlZCB1c2luZyB0aGUgcGFkZGluZyBwcm9wZXJ0eS4gSWYgZmFsc2UsIHRoZSBvcmRpbmFsIHNjYWxlIHdpbGwgY29uc3RydWN0IGV2ZW5seS1zcGFjZWQgYmFuZHMsIHJhdGhlciB0aGFuIHBvaW50cy4nXHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHR5cGljYWxTY2FsZU1peGluID0ge1xyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIC8qIFF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgU2NhbGUgUHJvcGVydGllcyAqL1xyXG4gICAgY2xhbXA6IHtcclxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIHZhbHVlcyB0aGF0IGV4Y2VlZCB0aGUgZGF0YSBkb21haW4gYXJlIGNsYW1wZWQgdG8gZWl0aGVyIHRoZSBtaW5pbXVtIG9yIG1heGltdW0gcmFuZ2UgdmFsdWUnXHJcbiAgICB9LFxyXG4gICAgbmljZToge1xyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIG9uZU9mOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdJZiB0cnVlLCBtb2RpZmllcyB0aGUgc2NhbGUgZG9tYWluIHRvIHVzZSBhIG1vcmUgaHVtYW4tZnJpZW5kbHkgbnVtYmVyIHJhbmdlIChlLmcuLCA3IGluc3RlYWQgb2YgNi45NikuJ1xyXG4gICAgICAgIH0se1xyXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICBlbnVtOiBbJ3NlY29uZCcsICdtaW51dGUnLCAnaG91cicsICdkYXknLCAnd2VlaycsICdtb250aCcsICd5ZWFyJ10sXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHNwZWNpZmllZCwgbW9kaWZpZXMgdGhlIHNjYWxlIGRvbWFpbiB0byB1c2UgYSBtb3JlIGh1bWFuLWZyaWVuZGx5IHZhbHVlIHJhbmdlLiBGb3IgdGltZSBhbmQgdXRjIHNjYWxlIHR5cGVzIG9ubHksIHRoZSBuaWNlIHZhbHVlIHNob3VsZCBiZSBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBkZXNpcmVkIHRpbWUgaW50ZXJ2YWw7IGxlZ2FsIHZhbHVlcyBhcmUgXCJzZWNvbmRcIiwgXCJtaW51dGVcIiwgXCJob3VyXCIsIFwiZGF5XCIsIFwid2Vla1wiLCBcIm1vbnRoXCIsIG9yIFwieWVhclwiLidcclxuICAgICAgICB9XHJcbiAgICAgIF0sXHJcbiAgICAgIC8vIEZJWE1FIHRoaXMgcGFydCBtaWdodCBicmVhayBwb2xlc3RhclxyXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdKSxcclxuICAgICAgZGVzY3JpcHRpb246ICcnXHJcbiAgICB9LFxyXG5cclxuICAgIC8qIFF1YW50aXRhdGl2ZSBTY2FsZSBQcm9wZXJ0aWVzICovXHJcbiAgICBleHBvbmVudDoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NldHMgdGhlIGV4cG9uZW50IG9mIHRoZSBzY2FsZSB0cmFuc2Zvcm1hdGlvbi4gRm9yIHBvdyBzY2FsZSB0eXBlcyBvbmx5LCBvdGhlcndpc2UgaWdub3JlZC4nXHJcbiAgICB9LFxyXG4gICAgemVybzoge1xyXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgZW5zdXJlcyB0aGF0IGEgemVybyBiYXNlbGluZSB2YWx1ZSBpcyBpbmNsdWRlZCBpbiB0aGUgc2NhbGUgZG9tYWluLiBUaGlzIG9wdGlvbiBpcyBpZ25vcmVkIGZvciBub24tcXVhbnRpdGF0aXZlIHNjYWxlcy4nLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFLCBURU1QT1JBTF0pXHJcbiAgICB9LFxyXG5cclxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5IFByb3BlcnRpZXMgKi9cclxuICAgIHVzZVJhd0RvbWFpbjoge1xyXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZXMgdGhlIHNvdXJjZSBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xyXG4gICAgICAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZWQgZGF0YSBmb3IgYWdncmVnYXRlIGF4aXMuICcgK1xyXG4gICAgICAgICAgICAgICAgICAgJ1RoaXMgb3B0aW9uIGRvZXMgbm90IHdvcmsgd2l0aCBzdW0gb3IgY291bnQgYWdncmVnYXRlJyArXHJcbiAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJyBcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgdmFyIG9yZGluYWxPbmx5U2NhbGUgPSBtZXJnZShjbG9uZShzY2FsZSksIG9yZGluYWxTY2FsZU1peGluKTtcclxuZXhwb3J0IHZhciB0eXBpY2FsU2NhbGUgPSBtZXJnZShjbG9uZShzY2FsZSksIG9yZGluYWxTY2FsZU1peGluLCB0eXBpY2FsU2NhbGVNaXhpbik7XHJcbiIsIi8vIFBhY2thZ2Ugb2YgZGVmaW5pbmcgVmVnYS1saXRlIFNwZWNpZmljYXRpb24ncyBqc29uIHNjaGVtYVxyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdmVnYS5kLnRzXCIvPlxyXG5cclxuaW1wb3J0ICogYXMgc2NoZW1hVXRpbCBmcm9tICcuL3NjaGVtYXV0aWwnO1xyXG5pbXBvcnQge21hcmt0eXBlfSBmcm9tICcuL21hcmt0eXBlLnNjaGVtYSc7XHJcbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuL2NvbmZpZy5zY2hlbWEnO1xyXG5pbXBvcnQge2RhdGEsIERhdGF9IGZyb20gJy4vZGF0YS5zY2hlbWEnO1xyXG5pbXBvcnQge2VuY29kaW5nLCBFbmNvZGluZ30gZnJvbSAnLi9lbmNvZGluZy5zY2hlbWEnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTcGVjIHtcclxuICBkYXRhPzogRGF0YTtcclxuICBtYXJrdHlwZT86IHN0cmluZztcclxuICBlbmNvZGluZz86IEVuY29kaW5nO1xyXG4gIGNvbmZpZz86IGFueTsgLy8gRklYTUU6IGRlY2xhcmVcclxufVxyXG5cclxuLy8gVE9ETyByZW1vdmUgdGhpc1xyXG5leHBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xyXG5cclxuZXhwb3J0IHZhciB1dGlsID0gc2NoZW1hVXRpbDtcclxuXHJcbi8qKiBAdHlwZSBPYmplY3QgU2NoZW1hIG9mIGEgdmVnYS1saXRlIHNwZWNpZmljYXRpb24gKi9cclxuZXhwb3J0IHZhciBzY2hlbWEgPSB7XHJcbiAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXHJcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uJyxcclxuICB0eXBlOiAnb2JqZWN0JyxcclxuICByZXF1aXJlZDogWydtYXJrdHlwZScsICdlbmNvZGluZyddLFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBtYXJrdHlwZTogbWFya3R5cGUsXHJcbiAgICBlbmNvZGluZzogZW5jb2RpbmcsXHJcbiAgICBjb25maWc6IGNvbmZpZ1xyXG4gIH1cclxufTtcclxuXHJcbi8qKiBJbnN0YW50aWF0ZSBhIHZlcmJvc2Ugdmwgc3BlYyBmcm9tIHRoZSBzY2hlbWEgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlKCkge1xyXG4gIHJldHVybiBzY2hlbWFVdGlsLmluc3RhbnRpYXRlKHNjaGVtYSk7XHJcbn07XHJcbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xyXG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoaW5zdGFuY2UsIHNjaGVtYSkge1xyXG4gIHJldHVybiBtZXJnZShpbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XHJcbn07XHJcblxyXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxyXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFudGlhdGUoc2NoZW1hKSB7XHJcbiAgdmFyIHZhbDtcclxuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfSBlbHNlIGlmICgnZGVmYXVsdCcgaW4gc2NoZW1hKSB7XHJcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcclxuICAgIHJldHVybiB1dGlsLmlzT2JqZWN0KHZhbCkgPyB1dGlsLmR1cGxpY2F0ZSh2YWwpIDogdmFsO1xyXG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcclxuICAgIGZvciAodmFyIG5hbWUgaW4gc2NoZW1hLnByb3BlcnRpZXMpIHtcclxuICAgICAgdmFsID0gaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xyXG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn07XHJcblxyXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcclxuZXhwb3J0IGZ1bmN0aW9uIHN1YnRyYWN0KGluc3RhbmNlLCBkZWZhdWx0cykge1xyXG4gIHZhciBjaGFuZ2VzOmFueSA9IHt9O1xyXG4gIGZvciAodmFyIHByb3AgaW4gaW5zdGFuY2UpIHtcclxuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcclxuICAgIHZhciBpbnMgPSBpbnN0YW5jZVtwcm9wXTtcclxuICAgIC8vIE5vdGU6IGRvZXMgbm90IHByb3Blcmx5IHN1YnRyYWN0IGFycmF5c1xyXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xyXG4gICAgICBpZiAodHlwZW9mIGlucyA9PT0gJ29iamVjdCcgJiYgIXV0aWwuaXNBcnJheShpbnMpICYmIGRlZikge1xyXG4gICAgICAgIHZhciBjID0gc3VidHJhY3QoaW5zLCBkZWYpO1xyXG4gICAgICAgIGlmICghaXNFbXB0eShjKSkge1xyXG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHV0aWwuaXNBcnJheShpbnMpKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNBcnJheShkZWYpKSB7XHJcbiAgICAgICAgICAvLyBjaGVjayBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5XHJcbiAgICAgICAgICBpZiAoaW5zLmxlbmd0aCA9PT0gZGVmLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZXF1YWwgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCA7IGkgPCBpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZiAoaW5zW2ldICE9PSBkZWZbaV0pIHtcclxuICAgICAgICAgICAgICAgIGVxdWFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVxdWFsKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7IC8vIGNvbnRpbnVlIHdpdGggbmV4dCBwcm9wZXJ0eVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY2hhbmdlcztcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShkZXN0LCAuLi5zcmM6IGFueVtdKXtcclxuICBmb3IgKHZhciBpPTAgOyBpPHNyYy5sZW5ndGg7IGkrKykge1xyXG4gICAgZGVzdCA9IG1lcmdlXyhkZXN0LCBzcmNbaV0pO1xyXG4gIH1cclxuICByZXR1cm4gZGVzdDtcclxufTtcclxuXHJcbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XHJcbmZ1bmN0aW9uIG1lcmdlXyhkZXN0LCBzcmMpIHtcclxuICBpZiAodHlwZW9mIHNyYyAhPT0gJ29iamVjdCcgfHwgc3JjID09PSBudWxsKSB7XHJcbiAgICByZXR1cm4gZGVzdDtcclxuICB9XHJcblxyXG4gIGZvciAodmFyIHAgaW4gc3JjKSB7XHJcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcclxuICAgICAgZGVzdFtwXSA9IHNyY1twXTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc3RbcF0gIT09ICdvYmplY3QnIHx8IGRlc3RbcF0gPT09IG51bGwpIHtcclxuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWVyZ2UoZGVzdFtwXSwgc3JjW3BdKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRlc3Q7XHJcbn1cclxuIiwiaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xyXG5pbXBvcnQge09SRElOQUwsIFFVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XHJcbmltcG9ydCB7dG9NYXB9IGZyb20gJy4uL3V0aWwnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTb3J0IHtcclxuICBmaWVsZDogc3RyaW5nO1xyXG4gIG9wOiBzdHJpbmc7XHJcbiAgb3JkZXI/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgc29ydCA9IHtcclxuICBkZWZhdWx0OiAnYXNjZW5kaW5nJyxcclxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgT1JESU5BTF0pLFxyXG4gIG9uZU9mOiBbXHJcbiAgICB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBlbnVtOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJywgJ3Vuc29ydGVkJ11cclxuICAgIH0sXHJcbiAgICB7IC8vIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYW5vdGhlciBmaWVsZFxyXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgcmVxdWlyZWQ6IFsnZmllbGQnLCAnb3AnXSxcclxuICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGZpZWxkOiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkIG5hbWUgdG8gYWdncmVnYXRlIG92ZXIuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3A6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgZW51bTogQUdHUkVHQVRFX09QUyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkIG5hbWUgdG8gYWdncmVnYXRlIG92ZXIuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3JkZXI6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZyddXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXVxyXG59O1xyXG4iLCIvKiogbW9kdWxlIGZvciBzaG9ydGhhbmQgKi9cclxuXHJcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XHJcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XHJcbmltcG9ydCB7U3BlY30gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcclxuXHJcbmltcG9ydCB7QUdHUkVHQVRFX09QU30gZnJvbSAnLi9hZ2dyZWdhdGUnO1xyXG5pbXBvcnQge1RJTUVVTklUU30gZnJvbSAnLi90aW1ldW5pdCc7XHJcbmltcG9ydCB7U0hPUlRfVFlQRSwgVFlQRV9GUk9NX1NIT1JUX1RZUEV9IGZyb20gJy4vdHlwZSc7XHJcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XHJcblxyXG5leHBvcnQgY29uc3QgREVMSU0gPSAnfCc7XHJcbmV4cG9ydCBjb25zdCBBU1NJR04gPSAnPSc7XHJcbmV4cG9ydCBjb25zdCBUWVBFID0gJywnO1xyXG5leHBvcnQgY29uc3QgRlVOQyA9ICdfJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbihzcGVjOiBTcGVjKTogc3RyaW5nIHtcclxuICByZXR1cm4gJ21hcmsnICsgQVNTSUdOICsgc3BlYy5tYXJrdHlwZSArXHJcbiAgICBERUxJTSArIHNob3J0ZW5FbmNvZGluZyhzcGVjLmVuY29kaW5nKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHNob3J0aGFuZDogc3RyaW5nLCBkYXRhPywgY29uZmlnPykge1xyXG4gIGxldCBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChERUxJTSksXHJcbiAgICBtYXJrdHlwZSA9IHNwbGl0LnNoaWZ0KCkuc3BsaXQoQVNTSUdOKVsxXS50cmltKCksXHJcbiAgICBlbmNvZGluZyA9IHBhcnNlRW5jb2Rpbmcoc3BsaXQuam9pbihERUxJTSkpO1xyXG5cclxuICBsZXQgc3BlYzpTcGVjID0ge1xyXG4gICAgbWFya3R5cGU6IG1hcmt0eXBlLFxyXG4gICAgZW5jb2Rpbmc6IGVuY29kaW5nXHJcbiAgfTtcclxuXHJcbiAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgc3BlYy5kYXRhID0gZGF0YTtcclxuICB9XHJcbiAgaWYgKGNvbmZpZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBzcGVjLmNvbmZpZyA9IGNvbmZpZztcclxuICB9XHJcbiAgcmV0dXJuIHNwZWM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRW5jb2RpbmcoZW5jb2Rpbmc6IEVuY29kaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gdmxFbmNvZGluZy5tYXAoZW5jb2RpbmcsIGZ1bmN0aW9uKGZpZWxkRGVmLCBjaGFubmVsKSB7XHJcbiAgICByZXR1cm4gY2hhbm5lbCArIEFTU0lHTiArIHNob3J0ZW5GaWVsZERlZihmaWVsZERlZik7XHJcbiAgfSkuam9pbihERUxJTSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUVuY29kaW5nKGVuY29kaW5nU2hvcnRoYW5kOiBzdHJpbmcpOiBFbmNvZGluZyB7XHJcbiAgcmV0dXJuIGVuY29kaW5nU2hvcnRoYW5kLnNwbGl0KERFTElNKS5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xyXG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChBU1NJR04pLFxyXG4gICAgICAgIGVuY3R5cGUgPSBzcGxpdFswXS50cmltKCksXHJcbiAgICAgICAgZmllbGREZWZTaG9ydGhhbmQgPSBzcGxpdFsxXTtcclxuXHJcbiAgICBtW2VuY3R5cGVdID0gcGFyc2VGaWVsZERlZihmaWVsZERlZlNob3J0aGFuZCk7XHJcbiAgICByZXR1cm4gbTtcclxuICB9LCB7fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmKTogc3RyaW5nIHtcclxuICByZXR1cm4gKGZpZWxkRGVmLmFnZ3JlZ2F0ZSA/IGZpZWxkRGVmLmFnZ3JlZ2F0ZSArIEZVTkMgOiAnJykgK1xyXG4gICAgKGZpZWxkRGVmLnRpbWVVbml0ID8gZmllbGREZWYudGltZVVuaXQgKyBGVU5DIDogJycpICtcclxuICAgIChmaWVsZERlZi5iaW4gPyAnYmluJyArIEZVTkMgOiAnJykgK1xyXG4gICAgKGZpZWxkRGVmLmZpZWxkIHx8ICcnKSArIFRZUEUgKyBTSE9SVF9UWVBFW2ZpZWxkRGVmLnR5cGVdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbkZpZWxkRGVmcyhmaWVsZERlZnM6IEZpZWxkRGVmW10sIGRlbGltID0gREVMSU0pOiBzdHJpbmcge1xyXG4gIHJldHVybiBmaWVsZERlZnMubWFwKHNob3J0ZW5GaWVsZERlZikuam9pbihkZWxpbSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpZWxkRGVmKGZpZWxkRGVmU2hvcnRoYW5kOiBzdHJpbmcpOiBGaWVsZERlZiB7XHJcbiAgdmFyIHNwbGl0ID0gZmllbGREZWZTaG9ydGhhbmQuc3BsaXQoVFlQRSksIGk7XHJcblxyXG4gIHZhciBmaWVsZERlZjogRmllbGREZWYgPSB7XHJcbiAgICBmaWVsZDogc3BsaXRbMF0udHJpbSgpLFxyXG4gICAgdHlwZTogVFlQRV9GUk9NX1NIT1JUX1RZUEVbc3BsaXRbMV0udHJpbSgpXVxyXG4gIH07XHJcblxyXG4gIC8vIGNoZWNrIGFnZ3JlZ2F0ZSB0eXBlXHJcbiAgZm9yIChpIGluIEFHR1JFR0FURV9PUFMpIHtcclxuICAgIHZhciBhID0gQUdHUkVHQVRFX09QU1tpXTtcclxuICAgIGlmIChmaWVsZERlZi5maWVsZC5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XHJcbiAgICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKGEubGVuZ3RoICsgMSk7XHJcbiAgICAgIGlmIChhID09PSAnY291bnQnICYmIGZpZWxkRGVmLmZpZWxkLmxlbmd0aCA9PT0gMCkgZmllbGREZWYuZmllbGQgPSAnKic7XHJcbiAgICAgIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9IGE7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yIChpIGluIFRJTUVVTklUUykge1xyXG4gICAgdmFyIHR1ID0gVElNRVVOSVRTW2ldO1xyXG4gICAgaWYgKGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkLmluZGV4T2YodHUgKyAnXycpID09PSAwKSB7XHJcbiAgICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKGZpZWxkRGVmLmZpZWxkLmxlbmd0aCArIDEpO1xyXG4gICAgICBmaWVsZERlZi50aW1lVW5pdCA9IHR1O1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGJpblxyXG4gIGlmIChmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZC5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcclxuICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKDQpO1xyXG4gICAgZmllbGREZWYuYmluID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaWVsZERlZjtcclxufVxyXG4iLCIvKiBVdGlsaXRpZXMgZm9yIGEgVmVnYS1MaXRlIHNwZWNpZmljaWF0aW9uICovXHJcblxyXG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xyXG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9jb21waWxlci9Nb2RlbCc7XHJcbmltcG9ydCB7U3BlY30gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcclxuaW1wb3J0IHtDT0xPUiwgREVUQUlMfSBmcm9tICcuL2NoYW5uZWwnO1xyXG5pbXBvcnQge0JBUiwgQVJFQX0gZnJvbSAnLi9tYXJrdHlwZSc7XHJcblxyXG4vLyBUT0RPOiBhZGQgdmwuc3BlYy52YWxpZGF0ZSAmIG1vdmUgc3R1ZmYgZnJvbSB2bC52YWxpZGF0ZSB0byBoZXJlXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzTm9PY2NsdXNpb24oc3BlYzogU3BlYyk6IGJvb2xlYW4ge1xyXG4gIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cclxuICByZXR1cm4gdmxFbmNvZGluZy5pc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsZWFuU3BlYyhzcGVjOiBTcGVjKTogU3BlYyB7XHJcbiAgLy8gVE9ETzogbW92ZSB0b1NwZWMgdG8gaGVyZSFcclxuICByZXR1cm4gbmV3IE1vZGVsKHNwZWMpLnRvU3BlYyh0cnVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhY2soc3BlYzogU3BlYyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoc3BlYy5lbmNvZGluZ1tDT0xPUl0uZmllbGQgfHwgc3BlYy5lbmNvZGluZ1tERVRBSUxdLmZpZWxkKSAmJlxyXG4gICAgKHNwZWMubWFya3R5cGUgPT09IEJBUiB8fCBzcGVjLm1hcmt0eXBlID09PSBBUkVBKSAmJlxyXG4gICAgKCFzcGVjLmNvbmZpZyB8fCAhc3BlYy5jb25maWcuc3RhY2sgIT09IGZhbHNlKSAmJlxyXG4gICAgdmxFbmNvZGluZy5pc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKTtcclxufVxyXG5cclxuLy8gVE9ETyByZXZpc2VcclxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcG9zZShzcGVjOiBTcGVjKTogU3BlYyB7XHJcbiAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jb2RpbmcsXHJcbiAgICBlbmNvZGluZyA9IGR1cGxpY2F0ZShzcGVjLmVuY29kaW5nKTtcclxuICBlbmNvZGluZy54ID0gb2xkZW5jLnk7XHJcbiAgZW5jb2RpbmcueSA9IG9sZGVuYy54O1xyXG4gIGVuY29kaW5nLnJvdyA9IG9sZGVuYy5jb2x1bW47XHJcbiAgZW5jb2RpbmcuY29sdW1uID0gb2xkZW5jLnJvdztcclxuICBzcGVjLmVuY29kaW5nID0gZW5jb2Rpbmc7XHJcbiAgcmV0dXJuIHNwZWM7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IFRJTUVVTklUUyA9IFtcclxuICAneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnXHJcbl07XHJcbiIsIi8qKiBDb25zdGFudHMgYW5kIHV0aWxpdGllcyBmb3IgZGF0YSB0eXBlICovXHJcblxyXG5leHBvcnQgY29uc3QgUVVBTlRJVEFUSVZFID0gJ3F1YW50aXRhdGl2ZSc7XHJcbmV4cG9ydCBjb25zdCBPUkRJTkFMID0gJ29yZGluYWwnO1xyXG5leHBvcnQgY29uc3QgVEVNUE9SQUwgPSAndGVtcG9yYWwnO1xyXG5leHBvcnQgY29uc3QgTk9NSU5BTCA9ICdub21pbmFsJztcclxuXHJcbi8qKlxyXG4gKiBNYXBwaW5nIGZyb20gZnVsbCB0eXBlIG5hbWVzIHRvIHNob3J0IHR5cGUgbmFtZXMuXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgU0hPUlRfVFlQRSA9IHtcclxuICBxdWFudGl0YXRpdmU6ICdRJyxcclxuICB0ZW1wb3JhbDogJ1QnLFxyXG4gIG5vbWluYWw6ICdOJyxcclxuICBvcmRpbmFsOiAnTydcclxufTtcclxuLyoqXHJcbiAqIE1hcHBpbmcgZnJvbSBzaG9ydCB0eXBlIG5hbWVzIHRvIGZ1bGwgdHlwZSBuYW1lcy5cclxuICogQHR5cGUge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBUWVBFX0ZST01fU0hPUlRfVFlQRSA9IHtcclxuICBROiBRVUFOVElUQVRJVkUsXHJcbiAgVDogVEVNUE9SQUwsXHJcbiAgTzogT1JESU5BTCxcclxuICBOOiBOT01JTkFMXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGZ1bGwsIGxvd2VyY2FzZSB0eXBlIG5hbWUgZm9yIGEgZ2l2ZW4gdHlwZS5cclxuICogQHBhcmFtICB7U3RyaW5nfSB0eXBlXHJcbiAqIEByZXR1cm4ge1N0cmluZ30gRnVsbCB0eXBlIG5hbWUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbE5hbWUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gVFlQRV9GUk9NX1NIT1JUX1RZUEVbdHlwZS50b1VwcGVyQ2FzZSgpXSB8fCAvLyBzaG9ydCB0eXBlIGlzIHVwcGVyY2FzZSBieSBkZWZhdWx0XHJcbiAgICAgICAgIHR5cGUudG9Mb3dlckNhc2UoKTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9kYXRhbGliLmQudHNcIi8+XHJcblxyXG5leHBvcnQgKiBmcm9tICdkYXRhbGliL3NyYy91dGlsJztcclxuZXhwb3J0ICogZnJvbSAnZGF0YWxpYi9zcmMvZ2VuZXJhdGUnO1xyXG5leHBvcnQgKiBmcm9tICdkYXRhbGliL3NyYy9zdGF0cyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zKGFycmF5LCBpdGVtKSB7XHJcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgPiAtMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmLCB0aGlzQXJnKSB7XHJcbiAgaWYgKG9iai5mb3JFYWNoKSB7XHJcbiAgICBvYmouZm9yRWFjaC5jYWxsKHRoaXNBcmcsIGYpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xyXG4gICAgICBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrICwgb2JqKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2Uob2JqLCBmLCBpbml0LCB0aGlzQXJnPykge1xyXG4gIGlmIChvYmoucmVkdWNlKSB7XHJcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xyXG4gICAgICBpbml0ID0gZi5jYWxsKHRoaXNBcmcsIGluaXQsIG9ialtrXSwgaywgb2JqKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpbml0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcChvYmosIGYsIHRoaXNBcmc/KSB7XHJcbiAgaWYgKG9iai5tYXApIHtcclxuICAgIHJldHVybiBvYmoubWFwLmNhbGwodGhpc0FyZywgZik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XHJcbiAgICAgIG91dHB1dC5wdXNoKCBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYW55KGFycjogQXJyYXk8YW55PiwgZjogKGQsIGs/LCBpPykgPT4gYm9vbGVhbikge1xyXG4gIHZhciBpID0gMCwgaztcclxuICBmb3IgKGsgaW4gYXJyKSB7XHJcbiAgICBpZiAoZihhcnJba10sIGssIGkrKykpIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhbGwoYXJyOiBBcnJheTxhbnk+LCBmOiAoZCwgaz8sIGk/KSA9PiBib29sZWFuKSB7XHJcbiAgdmFyIGkgPSAwLCBrO1xyXG4gIGZvciAoayBpbiBhcnIpIHtcclxuICAgIGlmICghZihhcnJba10sIGssIGkrKykpIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8vIEZJWE1FIHJlbW92ZSB0aGlzXHJcbmltcG9ydCBkbEJpbiA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2JpbnMvYmlucycpO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0YmlucyhzdGF0cywgbWF4Ymlucykge1xyXG4gIHJldHVybiBkbEJpbih7XHJcbiAgICBtaW46IHN0YXRzLm1pbixcclxuICAgIG1heDogc3RhdHMubWF4LFxyXG4gICAgbWF4YmluczogbWF4Ymluc1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IobWVzc2FnZTogYW55KTogdm9pZCB7XHJcbiAgY29uc29sZS5lcnJvcignW1ZMIEVycm9yXScsIG1lc3NhZ2UpO1xyXG59XHJcbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcclxuXHJcbi8vIFRPRE86IG1vdmUgdG8gdmwuc3BlYy52YWxpZGF0b3I/XHJcblxyXG5pbXBvcnQge3RvTWFwfSBmcm9tICcuL3V0aWwnO1xyXG5pbXBvcnQge3NjaGVtYX0gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcclxuXHJcbmludGVyZmFjZSBSZXF1aXJlZENoYW5uZWxNYXAge1xyXG4gIFttYXJrdHlwZTpzdHJpbmddOiBBcnJheTxzdHJpbmc+O1xyXG59XHJcblxyXG4vKipcclxuICogUmVxdWlyZWQgRW5jb2RpbmcgQ2hhbm5lbHMgZm9yIGVhY2ggbWFyayB0eXBlXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUDogUmVxdWlyZWRDaGFubmVsTWFwID0ge1xyXG4gIHRleHQ6IFsndGV4dCddLFxyXG4gIGxpbmU6IFsneCcsICd5J10sXHJcbiAgYXJlYTogWyd4JywgJ3knXVxyXG59O1xyXG5cclxuaW50ZXJmYWNlIFN1cHBvcnRlZENoYW5uZWxNYXAge1xyXG4gIFttYXJrdHlwZTpzdHJpbmddOiB7XHJcbiAgICBbY2hhbm5lbDpzdHJpbmddOiBudW1iZXJcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogU3VwcG9ydGVkIEVuY29kaW5nIENoYW5uZWwgZm9yIGVhY2ggbWFyayB0eXBlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TVVBQT1JURURfQ0hBTk5FTF9UWVBFOiBTdXBwb3J0ZWRDaGFubmVsTWFwID0ge1xyXG4gIGJhcjogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdzaXplJywgJ2NvbG9yJywgJ2RldGFpbCddKSxcclxuICBsaW5lOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSwgLy8gVE9ETzogYWRkIHNpemUgd2hlbiBWZWdhIHN1cHBvcnRzXHJcbiAgYXJlYTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksXHJcbiAgdGljazogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksXHJcbiAgY2lyY2xlOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxyXG4gIHNxdWFyZTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCddKSxcclxuICBwb2ludDogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCcsICdzaGFwZSddKSxcclxuICB0ZXh0OiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAnc2l6ZScsICdjb2xvcicsICd0ZXh0J10pIC8vVE9ETygjNzI0KSByZXZpc2VcclxufTtcclxuXHJcbi8vIFRPRE86IGNvbnNpZGVyIGlmIHdlIHNob3VsZCBhZGQgdmFsaWRhdGUgbWV0aG9kIGFuZFxyXG4vLyByZXF1aXJlcyBaU2NoZW1hIGluIHRoZSBtYWluIHZlZ2EtbGl0ZSByZXBvXHJcblxyXG4vKipcclxuICAqIEZ1cnRoZXIgY2hlY2sgaWYgZW5jb2RpbmcgbWFwcGluZyBvZiBhIHNwZWMgaXMgaW52YWxpZCBhbmRcclxuICAqIHJldHVybiBlcnJvciBpZiBpdCBpcyBpbnZhbGlkLlxyXG4gICpcclxuICAqIFRoaXMgY2hlY2tzIGlmXHJcbiAgKiAoMSkgYWxsIHRoZSByZXF1aXJlZCBlbmNvZGluZyBjaGFubmVscyBmb3IgdGhlIG1hcmsgdHlwZSBhcmUgc3BlY2lmaWVkXHJcbiAgKiAoMikgYWxsIHRoZSBzcGVjaWZpZWQgZW5jb2RpbmcgY2hhbm5lbHMgYXJlIHN1cHBvcnRlZCBieSB0aGUgbWFyayB0eXBlXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHNwZWMgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7UmVxdWlyZWRDaGFubmVsTWFwICA9IERlZmF1bHRSZXF1aXJlZENoYW5uZWxNYXB9ICByZXF1aXJlZENoYW5uZWxNYXBcclxuICAqIEBwYXJhbSAge1N1cHBvcnRlZENoYW5uZWxNYXAgPSBEZWZhdWx0U3VwcG9ydGVkQ2hhbm5lbE1hcH0gc3VwcG9ydGVkQ2hhbm5lbE1hcFxyXG4gICogQHJldHVybiB7U3RyaW5nfSBSZXR1cm4gb25lIHJlYXNvbiB3aHkgdGhlIGVuY29kaW5nIGlzIGludmFsaWQsXHJcbiAgKiAgICAgICAgICAgICAgICAgIG9yIG51bGwgaWYgdGhlIGVuY29kaW5nIGlzIHZhbGlkLlxyXG4gICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvZGluZ01hcHBpbmdFcnJvcihzcGVjOiBTcGVjLFxyXG4gICAgICByZXF1aXJlZENoYW5uZWxNYXA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVAsXHJcbiAgICAgIHN1cHBvcnRlZENoYW5uZWxNYXA6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEVcclxuICAgICkge1xyXG4gIGxldCBtYXJrdHlwZSA9IHNwZWMubWFya3R5cGU7XHJcbiAgbGV0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcclxuICBsZXQgcmVxdWlyZWRDaGFubmVscyA9IHJlcXVpcmVkQ2hhbm5lbE1hcFttYXJrdHlwZV07XHJcbiAgbGV0IHN1cHBvcnRlZENoYW5uZWxzID0gc3VwcG9ydGVkQ2hhbm5lbE1hcFttYXJrdHlwZV07XHJcblxyXG4gIGZvciAobGV0IGkgaW4gcmVxdWlyZWRDaGFubmVscykgeyAvLyBhbGwgcmVxdWlyZWQgY2hhbm5lbHMgYXJlIGluIGVuY29kaW5nYFxyXG4gICAgaWYgKCEocmVxdWlyZWRDaGFubmVsc1tpXSBpbiBlbmNvZGluZykpIHtcclxuICAgICAgcmV0dXJuICdNaXNzaW5nIGVuY29kaW5nIGNoYW5uZWwgXFxcIicgKyByZXF1aXJlZENoYW5uZWxzW2ldICtcclxuICAgICAgICAgICAgICAnXFxcIiBmb3IgbWFya3R5cGUgXFxcIicgKyBtYXJrdHlwZSArICdcXFwiJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAobGV0IGNoYW5uZWwgaW4gZW5jb2RpbmcpIHsgLy8gYWxsIGNoYW5uZWxzIGluIGVuY29kaW5nIGFyZSBzdXBwb3J0ZWRcclxuICAgIGlmICghc3VwcG9ydGVkQ2hhbm5lbHNbY2hhbm5lbF0pIHtcclxuICAgICAgcmV0dXJuICdFbmNvZGluZyBjaGFubmVsIFxcXCInICsgY2hhbm5lbCArXHJcbiAgICAgICAgICAgICAnXFxcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IG1hcmsgdHlwZSBcXFwiJyArIG1hcmt0eXBlICsgJ1xcXCInO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKG1hcmt0eXBlID09PSAnYmFyJyAmJiAhZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xyXG4gICAgcmV0dXJuICdNaXNzaW5nIGJvdGggeCBhbmQgeSBmb3IgYmFyJztcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIHZsQmluIGZyb20gJy4vYmluJztcclxuaW1wb3J0ICogYXMgdmxDaGFubmVsIGZyb20gJy4vY2hhbm5lbCc7XHJcbmltcG9ydCAqIGFzIHZsRGF0YSBmcm9tICcuL2RhdGEnO1xyXG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xyXG5pbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4vZmllbGRkZWYnO1xyXG5pbXBvcnQgKiBhcyB2bENvbXBpbGVyIGZyb20gJy4vY29tcGlsZXIvY29tcGlsZXInO1xyXG5pbXBvcnQgKiBhcyB2bFNjaGVtYSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xyXG5pbXBvcnQgKiBhcyB2bFNob3J0aGFuZCBmcm9tICcuL3Nob3J0aGFuZCc7XHJcbmltcG9ydCAqIGFzIHZsU3BlYyBmcm9tICcuL3NwZWMnO1xyXG5pbXBvcnQgKiBhcyB2bFRpbWVVbml0IGZyb20gJy4vdGltZXVuaXQnO1xyXG5pbXBvcnQgKiBhcyB2bFR5cGUgZnJvbSAnLi90eXBlJztcclxuaW1wb3J0ICogYXMgdmxWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJztcclxuaW1wb3J0ICogYXMgdmxVdGlsIGZyb20gJy4vdXRpbCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCB2YXIgYmluID0gdmxCaW47XHJcbmV4cG9ydCB2YXIgY2hhbm5lbCA9IHZsQ2hhbm5lbDtcclxuZXhwb3J0IHZhciBjb21waWxlciA9IHZsQ29tcGlsZXI7XHJcbmV4cG9ydCB2YXIgY29tcGlsZSA9IHZsQ29tcGlsZXIuY29tcGlsZTtcclxuZXhwb3J0IHZhciBkYXRhID0gdmxEYXRhO1xyXG5leHBvcnQgdmFyIGVuY29kaW5nID0gdmxFbmNvZGluZztcclxuZXhwb3J0IHZhciBmaWVsZERlZiA9IHZsRmllbGREZWY7XHJcbmV4cG9ydCB2YXIgc2NoZW1hID0gdmxTY2hlbWE7XHJcbmV4cG9ydCB2YXIgc2hvcnRoYW5kID0gdmxTaG9ydGhhbmQ7XHJcbmV4cG9ydCB2YXIgc3BlYyA9IHZsU3BlYztcclxuZXhwb3J0IHZhciB0aW1lVW5pdCA9IHZsVGltZVVuaXQ7XHJcbmV4cG9ydCB2YXIgdHlwZSA9IHZsVHlwZTtcclxuZXhwb3J0IHZhciB1dGlsID0gdmxVdGlsO1xyXG5leHBvcnQgdmFyIHZhbGlkYXRlID0gdmxWYWxpZGF0ZTtcclxuXHJcbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJ19fVkVSU0lPTl9fJztcclxuIl19
