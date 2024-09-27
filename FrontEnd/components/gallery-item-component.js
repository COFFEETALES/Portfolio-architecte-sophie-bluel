// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

// Quelques références:
// https://webreflection.co.uk/blog/2016/08/30/js-super-problem/
// https://javascript.plainenglish.io/introduction-to-web-components-in-javascript-create-a-hello-world-web-component-e624874ec3b1

/**
 * @class
 * @constructor
 * @extends {HTMLElement}
 */
var GalleryItemComponent = (
  function () {
    /** @const {!GalleryItemComponent} */
    var retVal = Reflect.construct(HTMLElement, [], GalleryItemComponent);

    GalleryItemComponent.constructor_.call(retVal);

    return retVal;
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
    var imgElement = /** @type {!HTMLImageElement} */(this.figureElement.querySelector('img'));

    imgElement.src = htmlElement.getAttribute('imageUrl');
    imgElement.alt = htmlElement.getAttribute('title');
    this.figureElement.querySelector('figcaption').textContent = htmlElement.getAttribute('title');
  }
);

/**
 * @this {GalleryItemComponent}
 * @return {void}
 * @private
 */
GalleryItemComponent.constructor_ = (
  function () {
    // /** @type {!Object} */
    // this.test1 = Object(1);

    /** @const {!HTMLElement} */
    var htmlElement = this;

    htmlElement.attachShadow({mode: 'open'});

    /** @const {!HTMLObjectElement} */
    var objectNode = Array.prototype.slice.call(
      document.getElementsByTagName('object'), -1
    )[0];

    /** @const {!Document} */
    var contentDocument = /** @type {!Document} */(objectNode.contentDocument);

    /** @const {!Element} */
    var galleryItemTemplate = /** @type {!Element} */(contentDocument.documentElement.firstElementChild);

    htmlElement.shadowRoot.appendChild(
      galleryItemTemplate.firstElementChild.cloneNode(true)
    );

    /** @const {!Node} */
    this.figureElement = (
      htmlElement.shadowRoot.appendChild(
        galleryItemTemplate.lastElementChild.cloneNode(true)
      )
    );
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
