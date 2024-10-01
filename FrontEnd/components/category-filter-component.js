// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @extends {WebComponent}
 */
var CategoryFilterComponent = (
  function () {
    return WebComponent.make(CategoryFilterComponent, '//bluel:category-filter-template[1]');
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

    /** @const {!CSSStyleSheet} */
    var styleSheet = new CSSStyleSheet();

    /** @type {number} */
    var i = 0;
    /** @const {!Array<string>} */
    var arr = [
      [
        ':host',
        '{',
          '--cat-filter-label:\'', /** @type {string} */(
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
    var startIdx = 0;

    do {
      styleSheet.insertRule(arr[i], startIdx + i);
    } while (++i !== len);

    this.root_.adoptedStyleSheets.unshift(styleSheet);

    /** @const {!HTMLInputElement} */
    var checkboxElement = /** @type {!HTMLInputElement} */(
      this.documentElement_
    );

    checkboxElement.onchange = this.onCheckboxChange.bind(this);
  }
);

/**
 * @this {CategoryFilterComponent}
 * @override
 */
CategoryFilterComponent.prototype.processCreation = (
  function () {
  }
);
