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
 *   GET_CATEGORIES: string,
 *   POST_USERS_LOGIN: string
 *  }
 * }
 */
var HttpEndpointsInterface;


/**
 * @const {HttpEndpointsInterface!}
 */
var HttpEndpoints = {
  GET_WORKS: [ServerHost, 'api', 'works'].join('/'),
  GET_CATEGORIES: [ServerHost, 'api', 'categories'].join('/'),
  POST_USERS_LOGIN: [ServerHost, 'api', 'users', 'login'].join('/')
};

/**
 * @class
 * @constructor
 */
var SophieBluel = (
  function () {
    /** @const {!Services.ApiService} */
    this.apiService = Services.ApiService.getInstance();

    Utils.me_().customElements.define('gallery-item', /** @type {function(new:HTMLElement)} */(WebComponents.GalleryItemComponent));
    Utils.me_().customElements.define('category-filter', /** @type {function(new:HTMLElement)} */(WebComponents.CategoryFilterComponent));

    /** @const {!HTMLElement} */
    var nav = /** @type {!HTMLElement} */(Utils.getElement('header-navigation-bar'));
    nav.onclick = SophieBluel.onNavClick_.bind(this);

    /** @const {!HTMLFormElement} */
    var loginForm = /** @type {!HTMLFormElement} */(Utils.getElement('form-login'));
    loginForm.onsubmit = SophieBluel.onLoginSumbit_.bind(this);

    /** @const {!Containers.GalleryContainer} */
    var gallery = Containers.GalleryContainer.getInstance();

    /** @const {!HTMLAnchorElement} */
    var logingLink = /** @type {!HTMLAnchorElement} */(
      Utils.getElement('anchor-login')
    );
    logingLink.onclick = SophieBluel.onNavLoginClick_.bind(this);

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
SophieBluel.onNavLoginClick_ = function (event) {
  if (!event) {
    return;
  }

  if (this.apiService.isLoggedIn()) {
    event.currentTarget.textContent = 'Login';
    this.apiService.logout();
    event.stopPropagation();
  }
};

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

  /** @const {!HTMLInputElement} */
  var submitButton = /** @type {!HTMLInputElement} */(
    Utils.getElement('login-submit')
  );

  /** @const {!HTMLInputElement} */
  var loginEmail = /** @type {!HTMLInputElement} */(
    Utils.getElement('login-email')
  );

  /** @const {!HTMLInputElement} */
  var loginPassword = /** @type {!HTMLInputElement} */(
    Utils.getElement('login-password')
  );

  this.apiService.login(
    loginEmail.value,
    loginPassword.value
  ).then(
    function () {
      /** @const {!HTMLAnchorElement} */
      var portfolioLink = /** @type {!HTMLAnchorElement} */(
        Utils.getElement('anchor-projects')
      );

      portfolioLink.click();

      /** @const {!HTMLAnchorElement} */
      var logingLink = /** @type {!HTMLAnchorElement} */(
        Utils.getElement('anchor-login')
      );
      logingLink.textContent = 'Logout';
    }
  ).catch(
    function (error) {
      submitButton.removeAttribute('disabled');
      console.error(error);
    }
  );

  submitButton.setAttribute('disabled', true);
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
        Utils.getElement(targetViews[i]).style.display = '';

        if ('login' === targetViews[i]) {
          /** @const {!HTMLInputElement} */
          var submitButton = /** @type {!HTMLInputElement} */(
            Utils.getElement('login-submit')
          );
          submitButton.removeAttribute('disabled');
        }
      }
    }
  }
};

window.onload = /** @const {function(Event?):void|null} */ (
  function (event) {
    new SophieBluel;
  }
);

