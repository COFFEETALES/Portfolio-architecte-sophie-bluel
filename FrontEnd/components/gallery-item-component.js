// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

// Quelques références:
// https://webreflection.co.uk/blog/2016/08/30/js-super-problem/
// https://javascript.plainenglish.io/introduction-to-web-components-in-javascript-create-a-hello-world-web-component-e624874ec3b1

/**
 * @class
 * @constructor
 * @extends {WebComponent}
 */
var GalleryItemComponent = (
  function () {
    return WebComponent.make(GalleryItemComponent, '//bluel:gallery-item-template[1]');
  }
);

GalleryItemComponent.prototype = Object.create(HTMLElement.prototype);

/**
 * @override
 * @return {void}
 */
GalleryItemComponent.prototype.connectedCallback = (
  function () {
    /** @const {!HTMLElement} */
    var htmlElement = this;

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(this.documentElement_.querySelector('img'));

    imgElement.src = htmlElement.getAttribute('imageUrl');
    imgElement.alt = htmlElement.getAttribute('title');

    this.documentElement_.querySelector('figcaption').textContent = htmlElement.getAttribute('title');
  }
);

/**
 * @this {GalleryItemComponent}
 * @override
 */
GalleryItemComponent.prototype.processCreation = (
  function () {
    // /** @type {!Object} */
    // this.test1 = Object(1);
  }
);

// /**
//  * @type {number}
//  */
// GalleryItemComponent.prototype.test = 1;
//
// /**
//  * @type {number}
//  */
// GalleryItemComponent.prototype.test2 = Object(2);
