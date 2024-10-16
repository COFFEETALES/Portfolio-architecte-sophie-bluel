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
 * @return {number}
 */
WebComponents.CategoryFilterComponent.prototype.getCategoryId = (
  function () {
    return Number(this.getAttribute('category-id'));
  }
);

/**
 * @return {string}
 */
WebComponents.CategoryFilterComponent.prototype.getCategoryName = (
  function () {
    return this.getAttribute('category-name');
  }
);

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
    /** @const {!HTMLInputElement} */
    var checkboxElement = /** @type {!HTMLInputElement} */(
      this.documentElement_
    );

    checkboxElement.dataset['categoryName'] = (
      this.getCategoryName()
    );

    checkboxElement.onchange = this.onCheckboxChange.bind(this);
  }
);
