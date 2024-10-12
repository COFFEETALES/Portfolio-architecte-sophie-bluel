// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

// Quelques références:
// https://webreflection.co.uk/blog/2016/08/30/js-super-problem/
// https://javascript.plainenglish.io/introduction-to-web-components-in-javascript-create-a-hello-world-web-component-e624874ec3b1

/**
 * @class
 * @constructor
 * @extends {Utils.WebComponent}
 * @private
 */
WebComponents.GalleryItemComponent = (
  function () {
    return Utils.WebComponent.make(WebComponents.GalleryItemComponent, '//bluel:gallery-item-template[1]');
  }
);

WebComponents.GalleryItemComponent.prototype = Object.create(HTMLElement.prototype);

/**
 * @type {number}
 */
WebComponents.GalleryItemComponent.prototype.itemCategoryId = -1;

/**
 * @override
 * @return {void}
 */
WebComponents.GalleryItemComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    this.itemCategoryId = Number(htmlElement.getAttribute('gallery-item-category-id'));

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(this.documentElement_.querySelector('img'));

    imgElement.src = htmlElement.getAttribute('gallery-item-imageurl');
    imgElement.alt = htmlElement.getAttribute('gallery-item-title');

    this.documentElement_.querySelector('figcaption').textContent = htmlElement.getAttribute('gallery-item-title');
  }
);

// /**
//  * @this {WebComponents.GalleryItemComponent}
//  * @override
//  */
// WebComponents.GalleryItemComponent.prototype.processCreation = (
//   function () {
//     // /** @type {!Object} */
//     // this.test1 = Object(1);
//   }
// );
//
// /**
//  * @type {number}
//  */
// WebComponents.GalleryItemComponent.prototype.test = 1;
//
// /**
//  * @type {number}
//  */
// WebComponents.GalleryItemComponent.prototype.test2 = Object(2);
