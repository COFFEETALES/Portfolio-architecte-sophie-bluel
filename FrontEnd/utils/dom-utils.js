// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/** @const {function():!Window} */
var me_ = function () { return /** @type {!Window} */(self); };

/** @const {function():void} */
var nullFunction = function () {};

/** @const {function(string):!Element} */
var getElement = function (str) {
  var /** !Element */ el = /** @type{!Element} */(document.getElementById(str));
  return el;
};

/** @const {function(!Document, string, !Element, number): !XPathResult} */
var xpathEvaluate = function (doc, expr, elem, xpathResult) {
  /** @const {
        function(
          this: Document,
          string,
          !Node,
          (function(string): string|null),
          number,
          (!XPathResult|null)
        ): !XPathResult
      }
  */
  var evaluate = Document.prototype['evaluate'];
  return (
    evaluate.call(
      doc,
      expr,
      elem,
      function /** string */ foo(/** string */ns) {
        /** @const {!Object<string, string>} */
        var nsMap = {
          'bluel': 'http://www.sophie-bluel.com/ns',
          'xhtml': 'http://www.w3.org/1999/xhtml'
        };
        return nsMap[ns];
      },
      xpathResult,
      null
    )
  );
};

