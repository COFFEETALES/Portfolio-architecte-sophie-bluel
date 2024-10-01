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

/** @const {function(!Node, number): (!Node|void)} */
var getChildNode = function(el, type) {
	var /** !NodeList<!Node> */ nodes = el.childNodes;
	var /** !Node */ node ;
	for (var /** @type {number} */ i = 0, /** @const {number} */ n = nodes.length ; i !== n ; ++i) {
		node = nodes[i];
		if (type === node.nodeType) { return /** @type{!Element|undefined} */(node); }
	}
};

