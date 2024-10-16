// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.MessageService = (
  function () {
    /**
     * @const {!HTMLDialogElement}
     * @private
     */
    this.dialogBox_ = /** @type {!HTMLDialogElement} */(
      Utils.getElement(
        'dialog-message-box'
      )
    );

    this.dialogBox_.onmousedown = (
      Utils.handleClickOutside
    );
  }
);

/**
 * @param {string} title
 * @param {string} message
 * @return {void}
 */
Services.MessageService.prototype.show = (
  function (title, message) {
    /** @const {!HTMLDivElement} */
    var divContent = /** @type {!HTMLDivElement} */(
      Utils.getElement(
        'dialog-message-box-content'
      )
    );
    divContent.firstElementChild.textContent = title;
    divContent.lastElementChild.textContent = message;
    this.dialogBox_.showModal();
  }
);

/**
 * @return {void}
 */
Services.MessageService.prototype.close = (
  function () {
    this.dialogBox_.close();
  }
);


/**
 * @type {!Services.MessageService|void}
 * @private
 */
Services.MessageService.instance_;

/**
 * @return {!Services.MessageService}
 */
Services.MessageService.getInstance = (
  function () {
    return Services.MessageService.instance_ || (Services.MessageService.instance_ = new Services.MessageService);
  }
);
