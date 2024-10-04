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

    /** @const {!HTMLElement} */
    var nav = /** @type {!HTMLElement} */(Utils.getElement('header-navigation-bar'));
    nav.onclick = SophieBluel.onNavClick_.bind(this);

    /** @const {!HTMLFormElement} */
    var loginForm = /** @type {!HTMLFormElement} */(Utils.getElement('form-login'));
    loginForm.onsubmit = SophieBluel.onLoginSumbit_.bind(this);

    Utils.me_().customElements.define('gallery-item', /** @type {function(new:HTMLElement)} */(WebComponents.GalleryItemComponent));
    Utils.me_().customElements.define('category-filter', /** @type {function(new:HTMLElement)} */(WebComponents.CategoryFilterComponent));

    /** @const {!Containers.GalleryContainer} */
    var gallery = Containers.GalleryContainer.getInstance();

    gallery.loadCategories();
    gallery.loadGallery();
  }
);

/**
 * @this {!SophieBluel}
 * below is optional param
 * @param {?Event=} event
 * @return {void}
 * @private
 */
SophieBluel.onLoginSumbit_ = function (event) {
  if (!event) {
    return;
  }

  event.preventDefault();
};

/**
 * @this {!SophieBluel}
 * @param {?Event} event
 * @return {void}
 * @private
 */
SophieBluel.onNavClick_ = function (event) {
  if (!event) {
    return;
  }

  event.stopImmediatePropagation();

  if (event.target instanceof HTMLAnchorElement) {
    /**
     * @const {!HTMLAnchorElement}
     */
    var anchor = /** @type {!HTMLAnchorElement} */(event.target);

    /**
     * @const {string|void}
     */
    var viewNames = anchor.dataset['viewNames'];

    if (viewNames) {
      // switchView

      /**
       * @const {!Array<string>}
       */
      var views = ['login', 'portfolio', 'contact'];

      for (var /** @type {number} */ i = 0, /** @type {number} */ n = views.length ; i !== n ; ++i) {
        Utils.getElement(views[i]).style.display = 'none';
      }

      /**
       * @const {!Array<string>}
       */
      var targetViews = viewNames.split(/,\s*/);

      for (i = 0, n = targetViews.length ; i !== n ; ++i) {
        Utils.getElement(targetViews[i]).style.display = 'block';
      }
    }
  }
};

window.onload = /** @const {function(Event?):void|null} */ (
  function (event) {
    new SophieBluel;
  }
);

