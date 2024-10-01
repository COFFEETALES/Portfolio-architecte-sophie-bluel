// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @abstract
 * @constructor
 * @extends {HTMLElement}
 */
var WebComponent = (
  function () {}
);


/**
 * @return {void}
 */
WebComponent.prototype.processCreation = (
  function () {}
);

/**
 * @const {!ShadowRoot}
 * @protected
 */
WebComponent.prototype.root_;

/**
 * @const {!Node}
 * @protected
 */
WebComponent.prototype.documentElement_;

/**
 * @type {!CSSStyleSheet|void}
 */
WebComponent.styleSheet_;

/**
 * @param {typeof WebComponent} ComponentClass
 * @param {string} xpathExpr
 * @return {!WebComponent}
 */
WebComponent.make = (
  function (ComponentClass, xpathExpr) {
    /** @const {!WebComponent} */
    var retVal = Reflect.construct(HTMLElement, [], ComponentClass);

    retVal.processCreation();

    /** @const {!HTMLElement} */
    var htmlElement = retVal;

    /** @const {!ShadowRoot} */
    retVal.root_ = htmlElement.attachShadow({mode: 'closed'});

    /** @const {!HTMLObjectElement} */
    var objectNode = /** @type {!HTMLObjectElement} */(
      getElement('sophie-bluel-xml')
    );

    /** @const {!Document} */
    var contentDocument = /** @type {!Document} */(
      objectNode.contentDocument
    );

    /** @const {!Element} */
    var webCompTemplate = /** @type {!Element} */(
      xpathEvaluate(
        contentDocument,
        xpathExpr,
        contentDocument.documentElement,
        XPathResult.FIRST_ORDERED_NODE_TYPE
      ).singleNodeValue
    );

    if (!ComponentClass.styleSheet_) {
      /** @const {!HTMLScriptElement} */
      var customStyle = /** @type {!HTMLScriptElement} */(webCompTemplate.firstElementChild);

      /** @const {!CDATASection} */
      var textNode = /** @type {!CDATASection} */(getChildNode(customStyle, Node.CDATA_SECTION_NODE));

      /** @type {string} */
      var str = textNode.data;

      ComponentClass.styleSheet_ = new CSSStyleSheet();
      ComponentClass.styleSheet_.replace(str);
    }

    retVal.root_.adoptedStyleSheets = [ComponentClass.styleSheet_];

    retVal.documentElement_ = (
      retVal.root_.appendChild(
        webCompTemplate.lastElementChild.cloneNode(true)
      )
    );

    return retVal;
  }
);

