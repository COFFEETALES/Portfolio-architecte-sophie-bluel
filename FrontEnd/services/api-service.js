// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.ApiService = (
  function () {
    /** @const {!Storage} */
    var sessionStorage = Utils.me_().sessionStorage;

    this.currentUserId_ = parseInt(sessionStorage.getItem('userId'), 10) || null;
    this.currentToken_ = sessionStorage.getItem('token') || null;

    if (this.isLoggedIn()) {
      Utils.me_().document.body.className = 'auth-state-active';
    }
  }
);

/**
 * @type {number|null}
 * @private
 */
Services.ApiService.prototype.currentUserId_ = null;

/**
 * @type {string|null}
 * @private
 */
Services.ApiService.prototype.currentToken_ = null;

/**
 * @return {boolean}
 */
Services.ApiService.prototype.isLoggedIn = (
  function () {
    return this.currentUserId_ !== null;
  }
);

/**
 * @param {string} method
 * @param {string} url
 * @param {(string|!FormData)=} data
 * @return {!Promise<!Response>}
 */
Services.ApiService.prototype.request = (
  function (method, url, data) {
    /**
     * @const {!Object<string, string>}
     */
    var headers = {
      'Accept': '*/*'
    };

    if ('string' === typeof data) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.currentToken_) {
      headers['X-Auth-User'] = this.currentUserId_.toString();
      headers['Authorization'] = 'Bearer ' + this.currentToken_;
    }

    return (
      fetch(
        url, {
          method: method,
          headers: headers,
          //mode: 'no-cors',
          credentials: 'same-origin',
          cache: 'no-cache',
          redirect: 'follow',
          referrer: 'no-referrer',
          referrerPolicy: 'no-referrer',
          keepalive: false,
          body: data
        }
      )
    );
  }
);

/**
 * @param {string} email
 * @param {string} password
 * @return {!Promise<void>}
 */
Services.ApiService.prototype.login = (
  function (email, password) {
    return (
      this.request(
        'POST',
        HttpEndpoints.POST_USERS_LOGIN,
        JSON.stringify(
          {'email': email, 'password': password}
        )
      ).then(
        function (response) {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Utils.AuthenticationError();
            }
            throw new Utils.UnexpectedError();
          }
          return response.json();
        }
      ).then(
        Services.ApiService.processLoginResponse_.bind(this)
      )
    );
  }
);

/**
 * @param {!ApiService_LoginInterface} login
 * @return {void}
 * @this {!Services.ApiService}
 * @throws {Error}
 * @private
 */
Services.ApiService.processLoginResponse_ = (
  function (login) {
    /** @const {!Storage} */
    var sessionStorage = Utils.me_().sessionStorage;
    sessionStorage.setItem('userId', login.userId.toString(10));
    sessionStorage.setItem('token', login.token);

    this.currentUserId_ = login.userId;
    this.currentToken_ = login.token;

    Utils.me_().document.body.className = 'auth-state-active';
  }
);

/**
 * @return {void}
 */
Services.ApiService.prototype.logout = (
  function () {
    Utils.me_().document.body.className = 'auth-state-inactive';
    this.currentUserId_ = null;
    this.currentToken_ = null;

    /** @const {!Storage} */
    var sessionStorage = Utils.me_().sessionStorage;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
  }
);

/**
 * @type {!Services.ApiService|void}
 * @private
 */
Services.ApiService.instance_;

/**
 * @return {!Services.ApiService}
 */
Services.ApiService.getInstance = (
  function () {
    return Services.ApiService.instance_ || (Services.ApiService.instance_ = new Services.ApiService);
  }
);
