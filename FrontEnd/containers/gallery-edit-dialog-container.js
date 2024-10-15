// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 */
Containers.GalleryEditDialogContainer = (
  function () {
    /** @const {!Services.RouterService} */
    this.routerService = Services.RouterService.getInstance();

    /** @const {!HTMLDialogElement} */
    this.dialogElement = this.routerService.editDialogElement;

    this.dialogElement['onclose'] = (
      Containers.GalleryEditDialogContainer.onDialogClose_.bind(this)
    );

    this.dialogElement.onclick = (
      Containers.GalleryEditDialogContainer.onDialogClick_.bind(this)
    );
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {!Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onDialogClose_ = (
  function (event) {
    /** @const {!URL} */
    var desiredUrl = new URL(Utils.me_().location.href);
    desiredUrl.pathname = '/Homepage_edit';
    this.routerService.navigate(desiredUrl);
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {!Event|null} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onDialogClick_ = (
  function (event) {
    /** @type {?Node} */
    var nodeElement = /** @type {?Node} */(event.target);

    do {
      if (this.dialogElement.firstElementChild === nodeElement) {
        return;
      }
    }
    while (nodeElement = nodeElement.parentNode);

    this.dialogElement.close();
  }
);
