// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @extends {Error}
 */
Utils.AuthenticationError = (
  function () {
    /** @const {!Utils.AuthenticationError} */
    var retVal = Reflect.construct(Error, [], Utils.AuthenticationError);
    return retVal;
  }
);

Utils.AuthenticationError.prototype = Object.create(Error.prototype);

/**
 * @class
 * @constructor
 * @extends {Error}
 */
Utils.UnexpectedError = (
  function () {
    /** @const {!Utils.UnexpectedError} */
    var retVal = Reflect.construct(Error, [], Utils.UnexpectedError);
    return retVal;
  }
);

Utils.UnexpectedError.prototype = Object.create(Error.prototype);

/** @const {function():!Window} */
Utils.me_ = function () { return /** @type {!Window} */(self); };

/** @const {function():void} */
Utils.nullFunction = function () {};

/** @const {function(string):!Element} */
Utils.getElement = function (str) {
  var /** !Element */ el = /** @type{!Element} */(document.getElementById(str));
  return el;
};

/** @const {function(!Document, string, !Element, number): !XPathResult} */
Utils.xpathEvaluate = function (doc, expr, elem, xpathResult) {
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
Utils.getChildNode = function(el, type) {
  var /** !NodeList<!Node> */ nodes = el.childNodes;
  var /** !Node */ node;
  for (var /** @type {number} */ i = 0, /** @const {number} */ n = nodes.length ; i !== n ; ++i) {
    node = nodes[i];
    if (type === node.nodeType) { return /** @type{!Element|undefined} */(node); }
  }
};

/**
 * @param {!Event|null} event
 * @return {void}
 */
Utils.handleClickOutside = (
  function (event) {
    /** @const {!HTMLDialogElement} */
    var dialogElement = /** @type {!HTMLDialogElement} */(event.currentTarget);

    /** @type {?Node} */
    var nodeElement = /** @type {?Node} */(event.target);

    /** @const {!Element} */
    var firstElement = /** @type {!Element} */(dialogElement.firstElementChild);

    do {
      if (firstElement === nodeElement) {
        return;
      }
    }
    while (nodeElement = nodeElement.parentNode);

    dialogElement.close();
  }
);
