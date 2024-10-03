// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @extends {Utils.WebComponent}
 * @private
 */
WebComponents.CategoryFilterComponent = (
  function () {
    return Utils.WebComponent.make(WebComponents.CategoryFilterComponent, '//bluel:category-filter-template[1]');
  }
);

WebComponents.CategoryFilterComponent.prototype = Object.create(HTMLElement.prototype);

/**
 * @type {number}
 */
WebComponents.CategoryFilterComponent.prototype.itemCategoryId = -1;

/**
 * @return {boolean}
 */
WebComponents.CategoryFilterComponent.prototype.isChecked = (
  function () {
    /** @const {!HTMLInputElement} */
    var checkboxElement = /** @type {!HTMLInputElement} */(
      this.documentElement_
    );
    return checkboxElement.checked;
  }
);

/**
 * @param {boolean} checked
 * @return {void}
 */
WebComponents.CategoryFilterComponent.prototype.setChecked = (
  function (checked) {
    /** @const {!HTMLInputElement} */
    var checkboxElement = /** @type {!HTMLInputElement} */(
      this.documentElement_
    );
    checkboxElement.checked = checked;
  }
);

/**
 * @return {void}
 */
WebComponents.CategoryFilterComponent.prototype.onCheckboxChange = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    /** @const {!Event} */
    var ev = (
      new CustomEvent(
        'categoryFilterChange', {
          bubbles: true,
          cancelable: true,
          detail: this
        }
      )
    );

    htmlElement.dispatchEvent(ev);
  }
);

/**
 * @override
 * @return {void}
 */
WebComponents.CategoryFilterComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    this.itemCategoryId = Number(htmlElement.getAttribute('categoryId'));

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
            })(htmlElement.getAttribute('categoryName'))
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
