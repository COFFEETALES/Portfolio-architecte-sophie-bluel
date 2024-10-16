// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @param {!Promise<void>} p1
 * @param {!Promise<void>} p2
 */
Containers.GalleryEditDialogContainer = (
  function (p1, p2) {
    /**
     * @const {!Promise<void>}
     * @private
     */
    this.galleryIsReady_ = Promise.all([p1, p2]).then(function () {});

    /**
     * @const {!Services.ProjectService}
     * @private
     */
    this.projectService_ = Services.ProjectService.getInstance();

    /**
     * @const {!Services.RouterService}
     * @private
     */
    this.routerService_ = Services.RouterService.getInstance();

    /**
     * @const {!HTMLDialogElement}
     * @private
     */
    this.dialogElement_ = this.routerService_.editDialogElement;

    this.dialogElement_['onclose'] = (
      Containers.GalleryEditDialogContainer.onDialogClose_.bind(this)
    );

    this.dialogElement_.onclick = (
      Containers.GalleryEditDialogContainer.onDialogClick_.bind(this)
    );

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
    this.addFileContainer_ = (
      Utils.getElement('portfolio-add-file')
    );

    /**
     * @const {!HTMLInputElement}
     * @private
     */
    this.attachProjectFile_ = /** @type {!HTMLInputElement} */(
      Utils.getElement('portfolio-attach-project-file')
    );

    /**
     * @const {!Element}
     * @private
     */
    this.galleryEdit_ = (
      Utils.getElement('portfolio-edit')
    );

    this.galleryEdit_.addEventListener(
      'enter', Containers.GalleryEditDialogContainer.onGalleryEditEnter_.bind(this)
    );

    /**
     * @const {!Element}
     * @private
     */
    this.galleryAdd_ = (
      Utils.getElement('portfolio-add')
    );

    this.galleryAdd_.addEventListener(
      'enter', Containers.GalleryEditDialogContainer.onGalleryAddEnter_.bind(this)
    );

    /**
     * @const {!HTMLInputElement}
     * @private
     */
    this.addTitle_ = /** @type {!HTMLInputElement} */(
      Utils.getElement('portfolio-add-title')
    );

    /**
     * @const {!HTMLSelectElement}
     * @private
     */
    this.addCategory_ = /** @type {!HTMLSelectElement} */(
      Utils.getElement('portfolio-add-category')
    );

    /**
     * @const {!Element}
     * @private
     */
    this.galleryEditContent_ = (
      Utils.getElement('portfolio-gallery-edit')
    );

    this.galleryEditContent_.addEventListener(
      'galleryEditItemClick', Containers.GalleryEditDialogContainer.onGalleryEditItemClick_.bind(this)
    );

    /**
     * @const {!FileReader}
     * @private
     */
    this.fileReader_ = new FileReader();

    this.fileReader_.onload = (
      Containers.GalleryEditDialogContainer.onFileReaderLoad_.bind(this)
    );

    Utils.getElement('gallery-edit-add-btn').onclick = (
      Containers.GalleryEditDialogContainer.moveToAddPage_.bind(this)
    );

    this.attachProjectFile_.onchange = (
      Containers.GalleryEditDialogContainer.onAttachProjectFile_.bind(this)
    );
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {?Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onFileReaderLoad_ = (
  function (event) {
    /** @const {string} */
    var result = /** @type {string} */(
      this.fileReader_.result
    );

    this.addFileContainer_.firstElementChild.style.display = 'none';
    this.addFileContainer_.lastElementChild.style.display = '';

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(
      Utils.getElement('gallery-edit-img-preview')
    );
    imgElement.src = result;
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {?Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onAttachProjectFile_ = (
  function (event) {
    /** @const {!HTMLInputElement} */
    var inputElement = /** @type {!HTMLInputElement} */(
      event.currentTarget
    );

    /** @const {!File} */
    var file = inputElement.files[0];

    this.fileReader_.readAsDataURL(file);
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {?Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.moveToAddPage_ = (
  function (event) {
    /** @const {!URL} */
    var desiredUrl = new URL(Utils.me_().location.href);
    desiredUrl.pathname = '/Homepage_edit_2';
    this.routerService_.navigate(desiredUrl);
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
Containers.GalleryEditDialogContainer.onGalleryAddEnter_ = (
  function (event) {
    this.addFileContainer_.firstElementChild.style.display = '';
    this.addFileContainer_.lastElementChild.style.display = 'none';

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(
      Utils.getElement('gallery-edit-img-preview')
    );
    imgElement.src = null;

    this.attachProjectFile_.value = null;

    this.addTitle_.value = '';
    this.addCategory_.selectedIndex = 0;

    while (1 < this.addCategory_.length) {
      this.addCategory_.remove(1);
    }

    this.galleryIsReady_.then(
      function () {
        /** @const {!Element} */
        var categoryCatalogue = (
          Utils.getElement('portfolio-category-catalogue')
        );

        var /** !NodeList<!Node> */ nodes = categoryCatalogue.childNodes;
        for (var /** number */ i = 0, /** number */ n = nodes.length ; i !== n ; ++i) {
          var /** !Node */ node = nodes[i];
          if (Node.ELEMENT_NODE === node.nodeType) {
            if (node instanceof WebComponents.CategoryFilterComponent) {
              /** @const {!WebComponents.CategoryFilterComponent} */
              var categoryFilter = /** @type {!WebComponents.CategoryFilterComponent} */(node);

              /** @const {number} */
              var categoryId = categoryFilter.getCategoryId();

              /** @const {string} */
              var categoryName = categoryFilter.getCategoryName();

              /** @const {!HTMLOptionElement} */
              var optionElement = /** @type {!HTMLOptionElement} */(
                document.createElement('option')
              );
              optionElement.value = categoryId.toString();
              optionElement.text = categoryName;
              this.addCategory_.add(optionElement);
            }
          }
        } // </for>
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
    var firstElement = /** @type {!Element} */(this.dialogElement_.firstElementChild);

    do {
      if (firstElement === nodeElement) {
        return;
      }
    }
    while (nodeElement = nodeElement.parentNode);

    this.dialogElement_.close();
  }
);
