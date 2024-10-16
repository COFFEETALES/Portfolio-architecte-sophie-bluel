// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @param {!Promise<void>} p1
 */
Containers.GalleryEditDialogContainer = (
  function (p1) {
    /**
     * @const {!Promise<void>}
     * @private
     */
    this.galleryIsReady_ = p1;

    /** @const {!Services.ProjectService} */
    this.projectService_ = Services.ProjectService.getInstance();

    /** @const {!Services.RouterService} */
    this.routerService_ = Services.RouterService.getInstance();

    /** @const {!HTMLDialogElement} */
    this.dialogElement = this.routerService_.editDialogElement;

//    /**
//     * @const {!Element}
//     * @private
//     */
//    this.galleryElement_ = (
//      Utils.getElement('portfolio-gallery')
//    );

    /**
     * @const {!Element}
     * @private
     */
    this.galleryEdit_ = (
      Utils.getElement('portfolio-gallery-edit')
    );

    /**
     * @const {!Element}
     * @private
     */
    this.galleryEditContent_ = (
      Utils.getElement('portfolio-gallery-edit-content')
    );

    this.galleryEditContent_.addEventListener(
      'galleryEditItemClick', Containers.GalleryEditDialogContainer.onGalleryEditItemClick_.bind(this)
    );

    this.dialogElement['onclose'] = (
      Containers.GalleryEditDialogContainer.onDialogClose_.bind(this)
    );

    this.dialogElement.onclick = (
      Containers.GalleryEditDialogContainer.onDialogClick_.bind(this)
    );

    this.galleryEdit_.addEventListener(
      'enter', Containers.GalleryEditDialogContainer.onGalleryEditEnter_.bind(this)
    );
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {!Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onGalleryEditItemClick_ = (
  function (event) {
    event.stopPropagation();
    //event.detail instanceof WebComponents.GalleryEditItemComponent

    /**
     * @const {!WebComponents.GalleryEditItemComponent}
     */
    var galleryEditItem = /** @type {!WebComponents.GalleryEditItemComponent} */(
      event.target
    );

    /**
     * @const {number}
     */
    var galleryItemId = galleryEditItem.getId();

    galleryEditItem.setDisabled(true);

    this.projectService_.deleteWorks(
      galleryItemId
    ).then(
      function () {
        /** @const {!Services.ProjectService.EntryItem} */
        var entryItem = /** @type {!Services.ProjectService.EntryItem} */(
          this.projectService_.deleteEntryItem(galleryItemId)
        );

        entryItem.galleryItemElement.parentNode.removeChild(
          entryItem.galleryItemElement
        );
        entryItem.galleryEditItemElement.parentNode.removeChild(
          entryItem.galleryEditItemElement
        );

      }.bind(this)
    ).finally(
      function () {
        galleryEditItem.setDisabled(false);
      }
    );
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {!Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onGalleryEditEnter_ = (
  function (event) {
    this.galleryIsReady_.then(
      function /** void */ foo() {
        /** @const {!Element} */
        var galleryEditContent = this.galleryEditContent_;

        while (galleryEditContent.firstChild) {
          galleryEditContent.removeChild(galleryEditContent.firstChild);
        }

        /** @const {number} */
        var n = this.projectService_.getEntryItemCount();
        for (var /** number */ i = 0 ; i !== n ; i++) {
          /** @const {!Services.ProjectService.EntryItem} */
          var entryItem = /** @type {!Services.ProjectService.EntryItem} */(
            this.projectService_.getEntryItem(i)
          );

          /** @const {!WebComponents.GalleryEditItemComponent} */
          var galleryEditItemElement = /** @type {!WebComponents.GalleryEditItemComponent} */(
            entryItem.galleryEditItemElement
          );

          galleryEditContent.appendChild(galleryEditItemElement);
        }
      }.bind(this)
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
    this.routerService_.navigate(desiredUrl);
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

    /** @type {!Element} */
    var firstElement = /** @type {!Element} */(this.dialogElement.firstElementChild);

    do {
      if (firstElement === nodeElement) {
        return;
      }
    }
    while (nodeElement = nodeElement.parentNode);

    this.dialogElement.close();
  }
);
