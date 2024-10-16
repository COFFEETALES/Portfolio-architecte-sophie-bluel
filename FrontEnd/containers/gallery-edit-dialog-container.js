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
    this.galleryIsReady_ = Promise.all([p1, p2]).then(Utils.nullFunction);

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

    /**
     * @const {!FileReader}
     * @private
     */
    this.fileReader_ = new FileReader();

    /** @const {!HTMLInputElement} */
    var attachProjectFile = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ATTACH_PROJECT_FILE
      )
    );

    /** @const {!Element} */
    var galleryEdit = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_EDIT
      )
    );

    /** @const {!Element} */
    var galleryAdd = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD
      )
    );

    /** @const {!Element} */
    var galleryEditContent = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_GALLERY_EDIT
      )
    );

    /** @const {!HTMLInputElement} */
    var addTitle = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_TITLE
      )
    );

    /** @const {!Element} */
    var galleryEditAddBtn = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.GALLERY_EDIT_ADD_BTN
      )
    );

    /** @const {!HTMLFormElement} */
    var addForm = /** @type {!HTMLFormElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_FORM
      )
    );

//    /** @const {!HTMLSelectElement} */
//    var addCategory = /** @type {!HTMLSelectElement} */(
//      Utils.getElement(
//        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_CATEGORY
//      )
//    );

    this.dialogElement_['onclose'] = (
      Containers.GalleryEditDialogContainer.onDialogClose_.bind(this)
    );

    this.dialogElement_.onmousedown = (
      Containers.GalleryEditDialogContainer.onDialogClick_.bind(this)
    );

    attachProjectFile.onchange = (
      Containers.GalleryEditDialogContainer.onAttachProjectFile_.bind(this)
    );

    galleryEdit.addEventListener(
      'enter', Containers.GalleryEditDialogContainer.onGalleryEditEnter_.bind(this)
    );

    galleryAdd.addEventListener(
      'enter', Containers.GalleryEditDialogContainer.onGalleryAddEnter_.bind(this)
    );

    galleryEditContent.addEventListener(
      'galleryEditItemClick', Containers.GalleryEditDialogContainer.onGalleryEditItemClick_.bind(this)
    );

    this.fileReader_.onload = (
      Containers.GalleryEditDialogContainer.onFileReaderLoad_.bind(this)
    );

    addTitle.onkeypress = (
      function /** void */ foo (/** ?Event */ event) {
        /** @const {!KeyboardEvent} */
        var keyEvent = /** @type {!KeyboardEvent} */(event);
        if (0x0d === keyEvent.keyCode) {
          /** @type {!Element} */(
            keyEvent.currentTarget
          ).blur();
        }
      }
    );

    galleryEditAddBtn.onclick = (
      Containers.GalleryEditDialogContainer.moveToAddPage_.bind(this)
    );

    addForm.onchange = (
      Containers.GalleryEditDialogContainer.onFormChange_.bind(this)
    );

    addForm.onsubmit = (
      Containers.GalleryEditDialogContainer.onFormSubmit_.bind(this)
    );
  }
);

/**
 * @const {
 *  {
 *   GALLERY_EDIT_ADD_BTN: string,
 *   GALLERY_EDIT_IMG_PREVIEW: string,
 *   PORTFOLIO_ADD: string,
 *   PORTFOLIO_ADD_CATEGORY: string,
 *   PORTFOLIO_ADD_FILE: string,
 *   PORTFOLIO_ADD_FORM: string,
 *   PORTFOLIO_ADD_TITLE: string,
 *   PORTFOLIO_ATTACH_PROJECT_FILE: string,
 *   PORTFOLIO_CATEGORY_CATALOGUE: string,
 *   PORTFOLIO_EDIT: string,
 *   PORTFOLIO_GALLERY: string,
 *   PORTFOLIO_GALLERY_EDIT: string,
 *   PORTFOLIO_GALLERY_EDIT_CONFIRM_BTN: string
 *  }
 * }
 * @private
 */
Containers.GalleryEditDialogContainer.elementIds_ = {
  GALLERY_EDIT_ADD_BTN: 'gallery-edit-add-btn',
  GALLERY_EDIT_IMG_PREVIEW: 'gallery-edit-img-preview',
  PORTFOLIO_ADD: 'portfolio-add',
  PORTFOLIO_ADD_CATEGORY: 'portfolio-add-category',
  PORTFOLIO_ADD_FILE: 'portfolio-add-file',
  PORTFOLIO_ADD_FORM: 'portfolio-add-form',
  PORTFOLIO_ADD_TITLE: 'portfolio-add-title',
  PORTFOLIO_ATTACH_PROJECT_FILE: 'portfolio-attach-project-file',
  PORTFOLIO_CATEGORY_CATALOGUE: 'portfolio-category-catalogue',
  PORTFOLIO_EDIT: 'portfolio-edit',
  PORTFOLIO_GALLERY: 'portfolio-gallery',
  PORTFOLIO_GALLERY_EDIT: 'portfolio-gallery-edit',
  PORTFOLIO_GALLERY_EDIT_CONFIRM_BTN: 'gallery-edit-confirm-btn',
};

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {?Event=} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onFormSubmit_ = (
  function (event) {
    event.preventDefault();

    /** @const {!HTMLFormControlsCollection} */
    var formControls = /** @type {!HTMLFormControlsCollection} */(
      /** @type {!HTMLFormElement} */(event.currentTarget).elements
    );

    /** @const {!File} */
    var file = (
      /** @type {!HTMLInputElement} */(formControls['image']).files[0]
    );

    /** @const {string} */
    var title = (
      /** @type {!HTMLInputElement} */(formControls['title']).value
    );

    /** @const {number} */
    var categoryId = (
      parseInt(
        /** @type {!HTMLSelectElement} */(formControls['category']).value, 10
      )
    );

    /** @const {!FileReader} */
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    /** @const {!Promise} */
    var p1 = (
      new Promise(
        function (res, rej) {
          fileReader.onload = (
            function () {
              /** @const {string} */
              var result = /** @type {string} */(
                fileReader.result
              );
              res(result);
            }
          );
          fileReader.onerror = rej;
        }
      )
    );

    p1.then(
      function /** !Promise<!ProjectService_PostWorkInterface> */ foo (/** string */ result) {
        return this.projectService_.postWorks(result, title, categoryId);
      }.bind(this)
    ).then(
      function foo (/** !ProjectService_PostWorkInterface */ work) {
        /** @const {!Element} */
        var gallery = (
          Utils.getElement(
            Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_GALLERY
          )
        );

        /** @const {!Services.ProjectService.EntryItem} */
        var entryItem = (
          this.projectService_.createEntryItem(work)
        );

        /** @const {!WebComponents.GalleryItemComponent} */
        var galleryItemElement = /** @type {!WebComponents.GalleryItemComponent} */(
          entryItem.galleryItemElement
        );

        gallery.appendChild(galleryItemElement);

        /** @const {!URL} */
        var desiredUrl = new URL(Utils.me_().location.href);
        desiredUrl.pathname = '/Homepage_edit_success';
        this.routerService_.navigate(desiredUrl);
      }.bind(this)
    );
  }
);

/**
 * @this {!Containers.GalleryEditDialogContainer}
 * @param {?Event} event
 * @return {void}
 * @private
 */
Containers.GalleryEditDialogContainer.onFormChange_ = (
  function (event) {
    /** @const {!HTMLFormElement} */
    var addForm = /** @type {!HTMLFormElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_FORM
      )
    );

    /** @const {!HTMLInputElement} */
    var editConfirmBtn = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_GALLERY_EDIT_CONFIRM_BTN
      )
    );

    /** @const {!URL} */
    var desiredUrl = new URL(Utils.me_().location.href);

    if (addForm.checkValidity()) {
      desiredUrl.pathname = '/Homepage_edit_3';

      editConfirmBtn.removeAttribute('disabled');
    }
    else {
      desiredUrl.pathname = '/Homepage_edit_2';

      editConfirmBtn.setAttribute('disabled', !addForm.checkValidity());
    }

    if (desiredUrl.pathname !== Utils.me_().location.pathname) {
      this.routerService_.navigate(desiredUrl, true);
      history.replaceState(void 0, '', desiredUrl.href);
    }
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

    /** @const {!Element} */
    var addFileContainer = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_FILE
      )
    );
    addFileContainer.lastElementChild.previousElementSibling.style.display = 'none';
    addFileContainer.lastElementChild.style.display = '';

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.GALLERY_EDIT_IMG_PREVIEW
      )
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

    if (FileReader.LOADING === this.fileReader_.readyState) {
      this.fileReader_.abort();
    }
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
    /** @const {!URL} */
    var desiredUrl = (
      new URL(
        /** @type {!CustomEvent<!URL>} */(event).detail
      )
    );

    /** @const {!HTMLSelectElement} */
    var addCategory = /** @type {!HTMLSelectElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_CATEGORY
      )
    );

    if ('/Homepage_edit_2' === desiredUrl.pathname) {
      if ('/Homepage_edit_3' === Utils.me_().location.pathname) {
        if (1 < addCategory.length) {
          return;
        }
      }
    }
    else if ('/Homepage_edit_3' === desiredUrl.pathname) {
      /** @const {!HTMLFormElement} */
      var addForm = /** @type {!HTMLFormElement} */(
        Utils.getElement(
          Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_FORM
        )
      );

      if (!addForm.checkValidity()) {
        desiredUrl.pathname = '/Homepage_edit_2';
        this.routerService_.navigate(desiredUrl, true);
        history.replaceState(void 0, '', desiredUrl.href);
      }
      return;
    }

    /** @const {!HTMLInputElement} */
    var editConfirmBtn = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_GALLERY_EDIT_CONFIRM_BTN
      )
    );
    editConfirmBtn.setAttribute('disabled', true);

    /** @const {!Element} */
    var addFileContainer = (
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_FILE
      )
    );
    addFileContainer.lastElementChild.previousElementSibling.style.display = '';
    addFileContainer.lastElementChild.style.display = 'none';

    /** @const {!HTMLImageElement} */
    var imgElement = /** @type {!HTMLImageElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.GALLERY_EDIT_IMG_PREVIEW
      )
    );
    imgElement.src = null;

    /** @const {!HTMLInputElement} */
    var attachProjectFile = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ATTACH_PROJECT_FILE
      )
    );
    attachProjectFile.value = null;

    /** @const {!HTMLInputElement} */
    var addTitle = /** @type {!HTMLInputElement} */(
      Utils.getElement(
        Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_ADD_TITLE
      )
    );
    addTitle.value = '';

    addCategory.selectedIndex = 0;

    while (1 < addCategory.length) {
      addCategory.remove(1);
    }

    this.galleryIsReady_.then(
      function () {
        /** @const {!Element} */
        var categoryCatalogue = (
          Utils.getElement(
            Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_CATEGORY_CATALOGUE
          )
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

              if (0 === categoryId) {
                continue;
              }

              /** @const {string} */
              var categoryName = categoryFilter.getCategoryName();

              /** @const {!HTMLOptionElement} */
              var optionElement = /** @type {!HTMLOptionElement} */(
                document.createElement('option')
              );
              optionElement.value = categoryId.toString();
              optionElement.text = categoryName;
              addCategory.add(optionElement);
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
        var galleryEditContent = (
          Utils.getElement(
            Containers.GalleryEditDialogContainer.elementIds_.PORTFOLIO_GALLERY_EDIT
          )
        );

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
    if ('/Homepage_edit_success' === Utils.me_().location.pathname) {
      return;
    }

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
