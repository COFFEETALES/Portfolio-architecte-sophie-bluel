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
 * @return {number}
 */
WebComponents.GalleryItemComponent.prototype.getId = (
  function () {
    return Number(this.getAttribute('gallery-item-id'));
  }
);

/**
 * @return {number}
 */
WebComponents.GalleryItemComponent.prototype.getCategoryId = (
  function () {
    return Number(this.getAttribute('gallery-item-category-id'));
  }
);

/**
 * @return {string}
 */
WebComponents.GalleryItemComponent.prototype.getTitle = (
  function () {
    return this.getAttribute('gallery-item-title');
  }
);

/**
 * @return {string}
 */
WebComponents.GalleryItemComponent.prototype.getImageUrl = (
  function () {
    return this.getAttribute('gallery-item-imageurl');
  }
);

/**
 * @override
 * @return {void}
 */
WebComponents.GalleryItemComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

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
