var base,
	alias = {
		'popwin': 'popwin/popwin',
		'tabchange': 'tabChange/tabChange',
		'history': 'history/history',
		'jqote': 'jqote/jqote',
		'datepicker': 'datepicker/datepicker',
		'upload': 'upload/upload',
		'dd': 'dd/dd',
		'lhgcalendar': 'lhgcalendar/lhgcalendar'
	};
location.href.indexOf('apps.admin.yunos-inc.com') !== -1 ? (function () {
	base = "wd/distpublish/widgets";
})() : (function () {
	base = "../widgets/";
})();
seajs.config({
	charset: 'utf-8',
	debug: false,
	base: base,
	alias: alias
});
var console = console || {};
if (!console.log) {
	console.log = function () {
	}
}
$.extend({
	unparam: function (str, sep, eq) {
		if (typeof str != 'string' || !(str = $.trim(str))) {
			return {};
		}
		sep = sep || '&';
		eq = eq || '=';
		var ret = {},
			eqIndex,
			decode = function (s) {
				return decodeURIComponent(s.replace(/\+/g, ' '));
			},
			endsWith = function (str, suffix) {
				var ind = str.length - suffix.length;
				return ind >= 0 && str.indexOf(suffix, ind) == ind;
			},
			pairs = str.split(sep),
			key, val,
			i = 0, len = pairs.length;
		for (; i < len; ++i) {
			eqIndex = pairs[i].indexOf(eq);
			if (eqIndex == -1) {
				key = decode(pairs[i]);
				val = undefined;
			} else {
				key = decode(pairs[i].substring(0, eqIndex));
				val = pairs[i].substring(eqIndex + 1);
				try {
					val = decode(val);
				} catch (e) {
				}
				if (endsWith(key, '[]')) {
					key = key.substring(0, key.length - 2);
				}
			}
			if (key in ret) {
				if ($.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}
			} else {
				ret[key] = val;
			}
		}
		return ret;
	},
	cloneObject: function (obj) {
		var o = obj.constructor === Array ? [] : {};
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
			}
		}
		return o;
	}
});
if (!$.fn.extend) $.extend($.fn, {'extend': $.extend});
$.fn.extend({
	zIndex: function (zIndex) {
		if (zIndex !== undefined) {
			return this.css("zIndex", zIndex);
		}
		if (this.length) {
			var elem = $(this[ 0 ]), position, value;
			while (elem.length && elem[ 0 ] !== document) {
				position = elem.css("position");
				if (position === "absolute" || position === "relative" || position === "fixed") {
					value = parseInt(elem.css("zIndex"), 10);
					if (!isNaN(value) && value !== 0) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}
		return 0;
	}
});
(function () {
	var matched, browser;
	$.uaMatch = function (ua) {
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
			/(webkit)[ \/]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
			/(msie) ([\w.]+)/.exec(ua) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
			[];
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
	matched = $.uaMatch(navigator.userAgent);
	browser = {};
	if (matched.browser) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}
	if (browser.chrome) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}
	$.browser = browser;
})();
(function () {
	if (typeof JSON !== 'object') {
		JSON = {};
	}
	(function () {
		'use strict';
		function f(n) {
			return n < 10 ? '0' + n : n;
		}

		if (typeof Date.prototype.toJSON !== 'function') {
			Date.prototype.toJSON = function (key) {
				return isFinite(this.valueOf())
					? this.getUTCFullYear() + '-' +
					f(this.getUTCMonth() + 1) + '-' +
					f(this.getUTCDate()) + 'T' +
					f(this.getUTCHours()) + ':' +
					f(this.getUTCMinutes()) + ':' +
					f(this.getUTCSeconds()) + 'Z'
					: null;
			};
			String.prototype.toJSON =
				Number.prototype.toJSON =
					Boolean.prototype.toJSON = function (key) {
						return this.valueOf();
					};
		}
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap,
			indent,
			meta = {    // table of character substitutions
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			},
			rep;

		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string'
					? c
					: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}

		function str(key, holder) {
			var i,          // The loop counter.
				k,          // The member key.
				v,          // The member value.
				length,
				mind = gap,
				partial,
				value = holder[key];
			if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
				value = value.toJSON(key);
			}
			if (typeof rep === 'function') {
				value = rep.call(holder, key, value);
			}
			switch (typeof value) {
				case 'string':
					return quote(value);
				case 'number':
					return isFinite(value) ? String(value) : 'null';
				case 'boolean':
				case 'null':
					return String(value);
				case 'object':
					if (!value) {
						return 'null';
					}
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === '[object Array]') {
						length = value.length;
						for (i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || 'null';
						}
						v = partial.length === 0
							? '[]'
							: gap
							? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
							: '[' + partial.join(',') + ']';
						gap = mind;
						return v;
					}
					if (rep && typeof rep === 'object') {
						length = rep.length;
						for (i = 0; i < length; i += 1) {
							if (typeof rep[i] === 'string') {
								k = rep[i];
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}
					} else {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}
					}
					v = partial.length === 0
						? '{}'
						: gap
						? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
						: '{' + partial.join(',') + '}';
					gap = mind;
					return v;
			}
		}

		if (typeof JSON.stringify !== 'function') {
			JSON.stringify = function (value, replacer, space) {
				var i;
				gap = '';
				indent = '';
				if (typeof space === 'number') {
					for (i = 0; i < space; i += 1) {
						indent += ' ';
					}
				} else if (typeof space === 'string') {
					indent = space;
				}
				rep = replacer;
				if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
						typeof replacer.length !== 'number')) {
					throw new Error('JSON.stringify');
				}
				return str('', {'': value});
			};
		}
		if (typeof JSON.parse !== 'function') {
			JSON.parse = function (text, reviver) {
				var j;

				function walk(holder, key) {
					var k, v, value = holder[key];
					if (value && typeof value === 'object') {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}

				text = String(text);
				cx.lastIndex = 0;
				if (cx.test(text)) {
					text = text.replace(cx, function (a) {
						return '\\u' +
							('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}
				if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
					j = eval('(' + text + ')');
					return typeof reviver === 'function'
						? walk({'': j}, '')
						: j;
				}
				throw new SyntaxError('JSON.parse');
			};
		}
	}());
})();
$.NM = function (lv1, lv2) {
	var w = window;
	w.APP = w.APP || {};
	w.APP[lv1] = w.APP[lv1] || {};
	if (lv2 !== undefined) {
		w.APP[lv1][lv2] = w.APP[lv1][lv2] || {};
	}
	return w.APP[lv1];
};
/*加载模版引擎*/
seajs.use('jqote');
var SEP = '&',
	EMPTY = '',
	EQ = '=',
	TRUE = true,
// FALSE = false,
	HEX_BASE = 16,
// http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
// http://wonko.com/post/html-escaping
	htmlEntities = {
		'&amp;': '&',
		'&gt;': '>',
		'&lt;': '<',
		'&#x60;': '`',
		'&#x2F;': '/',
		'&quot;': '"',
		'&#x27;': "'"
	},
	reverseEntities = {},
	escapeReg,
	unEscapeReg,
// - # $ ^ * ( ) + [ ] { } | \ , . ?
	escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
(function () {
	for (var k in htmlEntities) {
		reverseEntities[htmlEntities[k]] = k;
	}
})();

function isValidParamValue(val) {
	var t = typeof val;
	// If the type of val is null, undefined, number, string, boolean, return TRUE.
	return val == null || (t !== 'object' && t !== 'function');
}
function getEscapeReg() {
	if (escapeReg) {
		return escapeReg
	}
	var str = EMPTY;
	$.each(htmlEntities, function (i, entity) {
		str += entity + '|';
	});
	str = str.slice(0, -1);
	return escapeReg = new RegExp(str, 'g');
}
function getUnEscapeReg() {
	if (unEscapeReg) {
		return unEscapeReg
	}
	var str = EMPTY;
	$.each(reverseEntities, function (entity) {
		str += entity + '|';
	});
	str += '&#(\\d{1,5});';
	return unEscapeReg = new RegExp(str, 'g');
}
$.extend({
	urlEncode: function (s) {
		return encodeURIComponent(String(s));
	},
	urlDecode: function (s) {
		return decodeURIComponent(s.replace(/\+/g, ' '));
	},
	fromUnicode: function (str) {
		return str.replace(/\\u([a-f\d]{4})/ig, function (m, u) {
			return  String.fromCharCode(parseInt(u, HEX_BASE));
		});
	},
	escapeHtml: function (str) {
		return (str + '').replace(getEscapeReg(), function (m) {
			return reverseEntities[m];
		});
	},
	escapeRegExp: function (str) {
		return str.replace(escapeRegExp, '\\$&');
	},
	unEscapeHtml: function (str) {
		return str.replace(getUnEscapeReg(), function (m, n) {
			return htmlEntities[m] || String.fromCharCode(+n);
		});
	}
});
