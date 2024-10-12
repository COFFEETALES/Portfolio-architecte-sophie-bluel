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
     * @const {
     *   !Array<{
     *     itemName: string,
     *     itemPathNames: !Array<string>,
     *     itemAuthPathNames: !Array<string>
     *   }>
     * }
     * @private
     */
    this.sectionItems_ = [];

    for (var /** @type {number} */ i = 0, /** @type {number} */ n = sections.snapshotLength ; i !== n ; ++i) {
      /** @const {!HTMLElement} */
      var section = /** @type {!HTMLElement} */(sections.snapshotItem(i));

      /** @const {string} */
      var path = section.dataset['path'];

      /** @const {string} */
      var authPath = section.dataset['authPath'];

      this.sectionItems_[this.sectionItems_.length] = (
        {
          itemName: section.id,
          itemPathNames: path.split(', '),
          itemAuthPathNames: authPath ? authPath.split(', ') : []
        }
      );
    }

    Utils.me_().onpopstate = (
      Services.RouterService.onPopState_.bind(this)
    );
  }
);

/**
 * @this {!Services.RouterService}
 * @param {?Event} event
 * @return {void|null}
 * @private
 */
Services.RouterService.onPopState_ = (
  function (event) {
//    /** @const {!PopStateEvent} */
//    var popStateEvent = /** @type {!PopStateEvent} */(event);

    /** @const {!URL} */
    var currentUrl = new URL(Utils.me_().location.href);

    this.navigate(currentUrl, true);
  }
);

/**
 * @param {!URL} url
 * @param {boolean=} opt_isPopState
 * @return {void}
 */
Services.RouterService.prototype.navigate = function (url, opt_isPopState) {
  if ('/' === url.pathname) {
    url.pathname = this.apiService.isLoggedIn() ? '/Homepage_edit' : '/Homepage';
  }

  for (var /** @type {number} */ i = 0, /** @type {number} */ n = this.sectionItems_.length ; i !== n ; ++i) {
    Utils.getElement(this.sectionItems_[i].itemName).style.display = 'none';
  }

  /**
   * @const {!Array<string>}
   */
  var targetViews = [];

  for (i = 0, n = this.sectionItems_.length ; i !== n ; ++i) {
    /** @const */
    var item = this.sectionItems_[i];

    /** @const {!Array<string>} */
    var currentPath = (
      this.apiService.isLoggedIn() ? item.itemAuthPathNames : item.itemPathNames
    );

    if (-1 !== currentPath.indexOf(url.pathname)) {
      targetViews[targetViews.length] = item.itemName;
    }
  }

  if (!targetViews.length) {
    targetViews[targetViews.length] = 'introduction';
  }

  /** @const {!URL} */
  var desiredUrl = url;

  for (i = 0, n = targetViews.length ; i !== n ; ++i) {
    Utils.getElement(targetViews[i]).style.display = '';
  }

  if (!opt_isPopState) {
    history.pushState({}, '', desiredUrl);
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
