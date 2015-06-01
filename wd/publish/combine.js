$.ready(function () {
	$('form').each(function (i, el) {
		el.reset();
	});
});

var console = console || {};
if (!console.log) {
	console.log = function () {}
}

$.NM = function (lv1, lv2) {
	var w = window;
	w.APP = w.APP || {};
	w.APP[lv1] = w.APP[lv1] || {};
	if (lv2 !== undefined) {
		w.APP[lv1][lv2] = w.APP[lv1][lv2] || {};
	}
	return w.APP[lv1];
};


;(function() {
    var A = $.NM('banner');

    A.init = function() {
        console.log('banner init~~~~111');
    };
}) ();

;(function() {
    var A = $.NM('example');

    A.init = function() {
        console.log('example init');
    };
}) ();