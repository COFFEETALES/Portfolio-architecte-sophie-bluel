// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @extends {Utils.WebComponent}
 * @private
 */
WebComponents.GalleryEditItemComponent = (
  function () {
    /**
     * @const {!HTMLInputElement}
     * @private
     */
    this.inputElement_;

    /** @const {!WebComponents.GalleryEditItemComponent} */
    var retVal = /** @type {!WebComponents.GalleryEditItemComponent} */(
      Utils.WebComponent.make(WebComponents.GalleryEditItemComponent, '//bluel:gallery-edit-item-template[1]')
    );

    retVal.inputElement_ = /** @type {!HTMLInputElement} */(
      retVal.documentElement_.querySelector('input[type="button"]')
    );

    return retVal;
  }
);

WebComponents.GalleryEditItemComponent.prototype = Object.create(HTMLElement.prototype);

/**
 * @return {number}
 */
WebComponents.GalleryEditItemComponent.prototype.getId = (
  function () {
    return Number(this.getAttribute('gallery-edit-item-id'));
  }
);

/**
 * @return {void}
 * @param {boolean} value
 */
WebComponents.GalleryEditItemComponent.prototype.setDisabled = (
  function (value) {
    this.inputElement_.disabled = value;
  }
);

/**
 * @this {!WebComponents.GalleryEditItemComponent}
 * @param {?Event} event
 * @return {void}
 * @private
 */
WebComponents.GalleryEditItemComponent.onClick_ = (
  function (event) {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    /** @const {!Event} */
    var ev = (
      new Event(
        'galleryEditItemClick', {
          bubbles: true,
          cancelable: true,
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
WebComponents.GalleryEditItemComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(this.documentElement_.querySelector('img'));

    imgElement.src = htmlElement.getAttribute('gallery-edit-item-imageurl');
    imgElement.alt = htmlElement.getAttribute('gallery-edit-item-title');

    /** @const {!HTMLInputElement} */
    var inputElement = this.inputElement_;

    inputElement.onclick = WebComponents.GalleryEditItemComponent.onClick_.bind(this);
  }
);
