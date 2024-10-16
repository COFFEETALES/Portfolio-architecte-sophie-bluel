// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @const {string}
 */
var ServerHost = 'http://localhost:5678';

/**
 * @typedef {
 *  {
 *   DELETE_WORKS: string,
 *   GET_CATEGORIES: string,
 *   GET_WORKS: string,
 *   POST_USERS_LOGIN: string,
 *   POST_WORKS: string
 *  }
 * }
 */
var HttpEndpointsInterface;


/**
 * @const {HttpEndpointsInterface!}
 */
var HttpEndpoints = {
  DELETE_WORKS: [ServerHost, 'api', 'works'].join('/'),
  GET_CATEGORIES: [ServerHost, 'api', 'categories'].join('/'),
  GET_WORKS: [ServerHost, 'api', 'works'].join('/'),
  POST_USERS_LOGIN: [ServerHost, 'api', 'users', 'login'].join('/'),
  POST_WORKS: [ServerHost, 'api', 'works'].join('/')
};

/**
 * @class
 * @constructor
 */
var SophieBluel = (
  function () {
    Utils.me_().customElements.define(
      'category-filter', /** @type {function(new:HTMLElement)} */(WebComponents.CategoryFilterComponent)
    );
    Utils.me_().customElements.define(
      'gallery-edit-item', /** @type {function(new:HTMLElement)} */(WebComponents.GalleryEditItemComponent)
    );
    Utils.me_().customElements.define(
      'gallery-item', /** @type {function(new:HTMLElement)} */(WebComponents.GalleryItemComponent)
    );

    /**
     * @const {!Services.ApiService}
     * @private
     */
    this.apiService_ = Services.ApiService.getInstance();

    /**
     * @const {!Services.RouterService}
     * @private
     */
    this.routerService_ = Services.RouterService.getInstance();

    /**
     * @const {!Services.MessageService}
     * @private
     */
    this.messageService_ = Services.MessageService.getInstance();


    /** @const {!HTMLElement} */
    var nav = /** @type {!HTMLElement} */(
      Utils.getElement('header-navigation-bar')
    );

    /** @const {!HTMLAnchorElement} */
    var projectEdit = /** @type {!HTMLAnchorElement} */(
      Utils.getElement('anchor-project-edit')
    );

    /** @const {!HTMLFormElement} */
    var loginForm = /** @type {!HTMLFormElement} */(
      Utils.getElement('form-login')
    );

    /** @const {!HTMLAnchorElement} */
    var loginLink = /** @type {!HTMLAnchorElement} */(
      Utils.getElement('anchor-login')
    );

    /** @const {!Containers.GalleryContainer} */
    var gallery = new Containers.GalleryContainer;

    nav.onclick = projectEdit.onclick = SophieBluel.onNavClick_.bind(this);

    loginForm.onsubmit = SophieBluel.onLoginSumbit_.bind(this);

    loginLink.onclick = SophieBluel.onNavLoginClick_.bind(this);

    ///** @const {!Containers.GalleryEditDialogContainer} */
    //var galleryEditDialogContainer = new Containers.GalleryEditDialogContainer;
    new Containers.GalleryEditDialogContainer(
      gallery.loadGallery(), gallery.loadCategories()
    );

    this.routerService_.navigate(new URL(Utils.me_().location.href), true);
  }
);

/**
 * @this {!SophieBluel}
 * @param {?Event=} event
 * @return {void}
 * @private
 */
SophieBluel.onNavLoginClick_ = function (event) {
  if (!event) {
    return;
  }

  if (this.apiService_.isLoggedIn()) {
    event.preventDefault();
    event.stopPropagation();

    this.apiService_.logout();

    /** @const {!HTMLAnchorElement} */
    var portfolioLink = /** @type {!HTMLAnchorElement} */(
      Utils.getElement('anchor-projects')
    );
    portfolioLink.click();
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

  this.apiService_.login(
    loginEmail.value,
    loginPassword.value
  ).then(
    function () {
      /** @const {!HTMLAnchorElement} */
      var portfolioLink = /** @type {!HTMLAnchorElement} */(
        Utils.getElement('anchor-projects')
      );
      portfolioLink.click();
    }
  ).catch(
    /** @type {function(*):void} */(
      function /** void */ foo (/** !Error */ error) {
        /** @const {!Error} */
        var argError = /** @type {!Error} */(
          error
        );
        console.error(argError);
        if (argError instanceof Utils.AuthenticationError) {
          this.messageService_.show('Erreur d\'authentification', 'Merci de vérifier vos coordonnées d\'accès.');
        }
        else {
          this.messageService_.show('Erreur inattendue', 'Une erreur inattendue est survenue. Il pourrait s\'agir d\'un problème de connexion.');
        }
      }.bind(this)
    )
  ).then(
    function () {
      submitButton.removeAttribute('disabled');
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

  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    event.stopPropagation();

    /**
     * @const {!HTMLAnchorElement}
     */
    var anchor = /** @type {!HTMLAnchorElement} */(event.target);

    /**
     * @type {!URL}
     */
    var desiredUrl;

    /**
     * @const {string}
     */
    var authHref = anchor.dataset['authHref'];

    if (this.apiService_.isLoggedIn()) {
      if (!authHref) {
        return;
      }

      desiredUrl = new URL(Utils.me_().location.href);
      desiredUrl.pathname = authHref;
    }
    else {
      desiredUrl = new URL(anchor.href);
    }

    this.routerService_.navigate(desiredUrl);
  }
};

Utils.me_().onload = /** @const {function(Event?):void|null} */ (
  function (event) {
    new SophieBluel;
  }
);

