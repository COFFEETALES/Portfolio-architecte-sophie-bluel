// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @extends {HTMLElement}
 */
var CategoryFilterComponent = (
  function () {
    /** @const {!CategoryFilterComponent} */
    var retVal = Reflect.construct(HTMLElement, [], CategoryFilterComponent);

    CategoryFilterComponent.constructor_.call(retVal);

    return retVal;
  }
);

CategoryFilterComponent.prototype = Object.create(HTMLElement.prototype);

/**
 * @return {void}
 */
CategoryFilterComponent.prototype.onCheckboxChange = (
  function () {
    console.log('onCheckboxChange', this);
  }
);

/**
 * @override
 * @return {void}
 */
CategoryFilterComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    /** @const {!HTMLStyleElement} */
    var styleElement = /** @type {!HTMLStyleElement} */(
      this.root_.firstElementChild
    );

    /** @const {!CSSStyleSheet} */
    var styleSheet = /** @type {!CSSStyleSheet} */(styleElement.sheet);

    /** @type {number} */
    var i = 0;
    /** @const {!Array<string>} */
    var arr = [
      [
        ':host ',
        '{',
          '--cat-filter-label: \'', /** @type {string} */(
            (function /** string */ foo (/** string */ str) {
              /** @const {number} */
              var len = str.length;

              /** @const {!Array<string>} */
              var retVal = [];

              for (var i = 0; i !== len; ++i) {
                retVal[retVal.length] = [
                  '\\', str.charCodeAt(i).toString(16).padStart(6, '0')
                ].join('');
              }

              return retVal.join('');
            })(htmlElement.getAttribute('name'))
          ), '\';',
        '}',
      ].join('')
    ];
    /** @const {number} */
    var len = arr.length;
    /** @const {number} */
    var startIdx = 0;//styleSheet.cssRules.length;

    do {
      styleSheet.insertRule(arr[i], startIdx + i);
    } while (++i !== len);

    this.inputElement.onchange = this.onCheckboxChange.bind(this);
  }
);

/**
 * @this {CategoryFilterComponent}
 * @return {void}
 * @private
 */
CategoryFilterComponent.constructor_ = (
  function () {
    // /** @type {!Object} */
    // this.test1 = Object(1);

    /** @const {!HTMLElement} */
    var htmlElement = this;

    /**
     * @const {!ShadowRoot}
     * @private
     */
    this.root_ = htmlElement.attachShadow({mode: 'closed'});

    /** @const {!HTMLObjectElement} */
    var objectNode = /** @type {!HTMLObjectElement} */(
      getElement('sophie-bluel-xml')
    );

    /** @const {!Document} */
    var contentDocument = /** @type {!Document} */(objectNode.contentDocument);

    /** @const {!Element} */
    var categoryFilterTemplate = /** @type {!Element} */(
      xpathEvaluate(
        contentDocument,
        '//bluel:category-filter-template[1]',
        contentDocument.documentElement,
        XPathResult.FIRST_ORDERED_NODE_TYPE
      ).singleNodeValue
    );

    this.root_.appendChild(
      categoryFilterTemplate.firstElementChild.cloneNode(true)
    );

    /** @const {!HTMLInputElement} */
    this.inputElement = (
      /** @type {!HTMLInputElement} */(
        this.root_.appendChild(
          categoryFilterTemplate.lastElementChild.cloneNode(true)
        )
      )
    );
  }
);
