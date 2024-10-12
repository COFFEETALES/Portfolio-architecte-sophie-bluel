// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @abstract
 * @constructor
 * @extends {HTMLElement}
 * @private
 */
Utils.WebComponent = (
  function () {}
);


// /**
//  * @return {void}
//  */
// Utils.WebComponent.prototype.processCreation = (
//   function () {}
// );

/**
 * @const {!ShadowRoot}
 * @protected
 */
Utils.WebComponent.prototype.root_;

/**
 * @const {!Node}
 * @protected
 */
Utils.WebComponent.prototype.documentElement_;

/**
 * @type {!CSSStyleSheet|null|void}
 */
Utils.WebComponent.styleSheet_;

/**
 * @param {typeof Utils.WebComponent} ComponentClass
 * @param {string} xpathExpr
 * @return {!Utils.WebComponent}
 */
Utils.WebComponent.make = (
  function (ComponentClass, xpathExpr) {
    /** @const {!Utils.WebComponent} */
    var retVal = Reflect.construct(HTMLElement, [], ComponentClass);

    /** @const {!HTMLElement} */
    var htmlElement = retVal;

    /** @const {!ShadowRoot} */
    retVal.root_ = htmlElement.attachShadow({mode: 'closed'});

    /** @const {!HTMLObjectElement} */
    var objectNode = /** @type {!HTMLObjectElement} */(
      Utils.getElement('sophie-bluel-xml')
    );

    /** @const {!Document} */
    var contentDocument = /** @type {!Document} */(
      objectNode.contentDocument
    );

    /** @const {!Element} */
    var webCompTemplate = /** @type {!Element} */(
      Utils.xpathEvaluate(
        contentDocument,
        xpathExpr,
        contentDocument.documentElement,
        XPathResult.FIRST_ORDERED_NODE_TYPE
      ).singleNodeValue
    );

    if (!ComponentClass.styleSheet_) n1: {
      /** @const {!HTMLScriptElement} */
      var customStyle = /** @type {!HTMLScriptElement} */(webCompTemplate.firstElementChild);

      /** @const {!CDATASection} */
      var textNode = /** @type {!CDATASection} */(Utils.getChildNode(customStyle, Node.CDATA_SECTION_NODE));

      /** @type {string} */
      var str = textNode.data;

      if (void 0 === ComponentClass.styleSheet_) {
        try {
          ComponentClass.styleSheet_ = new CSSStyleSheet();
        }
        catch (/** @type {!Error} */ e) {
          if (e instanceof TypeError) {
            ComponentClass.styleSheet_ = null;
          }
          else {
            throw e;
          }
        }
      }

      if (ComponentClass.styleSheet_) {
        ComponentClass.styleSheet_.replaceSync(str);
        retVal.root_.adoptedStyleSheets = [ComponentClass.styleSheet_];
        break n1;
      }

      /** @const {!HTMLLinkElement} */
      var htmlStyle = /** @const {!HTMLLinkElement} */(document.createElement('style'));
      // WebKit Hack
      htmlStyle.appendChild(document.createTextNode(''));

      if (htmlStyle.textContent) {
        htmlStyle.textContent = str;
      }
      else {
        htmlStyle.innerHTML = str;
      }

      retVal.root_.appendChild(htmlStyle);
    }
    else {
      retVal.root_.adoptedStyleSheets = [ComponentClass.styleSheet_];
    }

    retVal.documentElement_ = (
      retVal.root_.appendChild(
        webCompTemplate.lastElementChild.cloneNode(true)
      )
    );

    return retVal;
  }
);

