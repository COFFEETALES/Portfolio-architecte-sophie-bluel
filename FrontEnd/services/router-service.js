// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.RouterService = (
  function () {
    /**
     * @const {!Services.ApiService}
     * @private
     */
    this.apiService_ = Services.ApiService.getInstance();

    /** @const {!Element} */
    var mainElement = document.getElementsByTagName('main')[0];

    /**
     * @const {!HTMLDialogElement}
     */
    this.editDialogElement = /** @type {!HTMLDialogElement} */(
      Utils.xpathEvaluate(
        document,
        './xhtml:dialog',
        mainElement,
        XPathResult.FIRST_ORDERED_NODE_TYPE
      ).singleNodeValue
    );

    /** @const {!XPathResult} */
    var sections = (
      Utils.xpathEvaluate(
        document,
        'xhtml:section | xhtml:dialog/xhtml:div/xhtml:section',
        mainElement,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE
      )
    );

    /**
     * @const {
     *   !Array<!Services.RouterService.SectionItem_>
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
          withinDialog: 'DIALOG' === section.parentElement.parentElement.tagName,
          itemName: section.id,
          itemPathNames: path ? path.split(', ') : [],
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
 * @typedef {
 *   {
 *     withinDialog: boolean,
 *     itemName: string,
 *     itemPathNames: !Array<string>,
 *     itemAuthPathNames: !Array<string>
 *   }
 * }
 * @private
 */
Services.RouterService.SectionItem_;

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
    url.pathname = this.apiService_.isLoggedIn() ? '/Homepage_edit' : '/Homepage';
  }

  /** @const {!URL} */
  var desiredUrl = url;

  /** @const {!Array<string>} */
  var targetViews = [];

  /** @type {!Services.RouterService.SectionItem_} */
  var item;

  for (var /** @type {number} */ i = 0, /** @type {number} */ n = this.sectionItems_.length ; i !== n ; ++i) {
    item = this.sectionItems_[i];

    /** @const {!Array<string>} */
    var currentPath = (
      this.apiService_.isLoggedIn() ? item.itemAuthPathNames : item.itemPathNames
    );

    if (-1 !== currentPath.indexOf(desiredUrl.pathname)) {
      targetViews[targetViews.length] = item.itemName;
    }
  }

  if (!targetViews.length) {
    targetViews[targetViews.length] = 'introduction';
  }

  /** @const {!CustomEvent<!URL>} */
  var leaveEvent = new CustomEvent('leave', {detail: desiredUrl});

  /** @const {!CustomEvent<!URL>} */
  var enterEvent = new CustomEvent('enter', {detail: desiredUrl});

  /** @type {!Element} */
  var elem;

  for (i = 0, n = this.sectionItems_.length ; i !== n ; ++i) {
    item = this.sectionItems_[i];

    /** @type {string} */
    var itemName = item.itemName;

    elem = Utils.getElement(itemName);

    if (-1 === targetViews.indexOf(itemName)) {
      if ('none' !== elem.style.display) {
        elem.style.display = 'none';
        elem.dispatchEvent(leaveEvent);
      }
      continue;
    }

    elem.style.display = '';
    elem.dispatchEvent(enterEvent);
  }

  for (i = 0, n = this.sectionItems_.length ; i !== n ; ++i) {
    item = this.sectionItems_[i];

    itemName = item.itemName;

    if (item.withinDialog && -1 !== targetViews.indexOf(itemName)) {
      elem = Utils.getElement(item.itemName);

      if (!this.editDialogElement.open) {
        this.editDialogElement.showModal();
      }
      break;
    }
    else if ((n - 1) === i) {
      if (this.editDialogElement.open) {
        this.editDialogElement.close();
      }
    }
  }

  if (!opt_isPopState) {
    history.pushState(void 0, '', desiredUrl);
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
