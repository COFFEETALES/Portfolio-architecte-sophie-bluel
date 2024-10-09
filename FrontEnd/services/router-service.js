// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.RouterService = (
  function () {
    /** @const {!Services.ApiService} */
    this.apiService = Services.ApiService.getInstance();

    /** @const {!XPathResult} */
    var sections = (
      Utils.xpathEvaluate(
        document,
        '/xhtml:html/xhtml:body/xhtml:main/xhtml:section',
        document.documentElement,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE
      )
    );

    /**
     * @const {!Array<{itemName: string, itemPath: string, itemAuthPath: string}>}
     * @private
     */
    this.sectionNames_ = [];

    for (var /** @type {number} */ i = 0, /** @type {number} */ n = sections.snapshotLength ; i !== n ; ++i) {
      /** @const {!HTMLElement} */
      var section = /** @type {!HTMLElement} */(sections.snapshotItem(i));
      this.sectionNames_[this.sectionNames_.length] = (
        {
          itemName: section.id,
          itemPath: section.dataset['path'],
          itemAuthPath: section.dataset['authPath'] || ''
        }
      );
    }
  }
);


/**
 * @param {string} viewNames
 * @return {void}
 */
Services.RouterService.prototype.navigate = function (viewNames) {

  Utils.getElement('logged-in-banner').style.display = (
    this.apiService.isLoggedIn() ? '' : 'none'
  );

  for (var /** @type {number} */ i = 0, /** @type {number} */ n = this.sectionNames_.length ; i !== n ; ++i) {
    Utils.getElement(this.sectionNames_[i].itemName).style.display = 'none';
  }

  /**
   * @const {!Array<string>}
   */
  var targetViews = viewNames.split(/,\s*/);

  /** @const {!URL} */
  var desiredUrl = new URL(window.location.href);

  for (i = 0, n = this.sectionNames_.length ; i !== n ; ++i) {
    if (this.sectionNames_[i].itemName === targetViews[0]) {
      desiredUrl.pathname = (
        this.apiService.isLoggedIn() ? this.sectionNames_[i].itemAuthPath : this.sectionNames_[i].itemPath
      );
      break;
    }
  }

  history.pushState({}, '', desiredUrl);

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
};

/**
 * @type {!Services.RouterService|void}
 * @private
 */
Services.RouterService.instance_;

/**
 * @return {!Services.RouterService}
 */
Services.RouterService.getInstance = (
  function () {
    return Services.RouterService.instance_ || (Services.RouterService.instance_ = new Services.RouterService);
  }
);
