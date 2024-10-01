// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @const {string}
 */
var ServerHost = 'http://localhost:5678';

/**
 * @typedef {
 *  {
 *   GET_WORKS: string,
 *   GET_CATEGORIES: string
 *  }
 * }
 */
var HttpEndpointsInterface;


/**
 * @const {HttpEndpointsInterface!}
 */
var HttpEndpoints = {
  GET_WORKS: [ServerHost, 'api', 'works'].join('/'),
  GET_CATEGORIES: [ServerHost, 'api', 'categories'].join('/')
};

/**
 * @class
 * @constructor
 */
var SophieBluel = (
  function () {
    me_().customElements.define('gallery-item', /** @type {function(new:HTMLElement)} */(GalleryItemComponent));
    me_().customElements.define('category-filter', /** @type {function(new:HTMLElement)} */(CategoryFilterComponent));

    /** @const {!CategoryCatalogueComponent} */
    this.categoryCatalogue = CategoryCatalogueComponent.getInstance();
    /** @const {!GalleryComponent} */
    this.gallery = GalleryComponent.getInstance();

    this.categoryCatalogue.loadCategories();
    this.gallery.loadGallery();
  }
);

window.onload = /** @const {function(Event?):void|null} */ (
  function (event) {
    new SophieBluel;
  }
);

