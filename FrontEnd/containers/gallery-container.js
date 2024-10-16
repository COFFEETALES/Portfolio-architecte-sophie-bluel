// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 */
Containers.GalleryContainer = (
  function () {
    /**
     * @const {!Services.ApiService}
     * @private
     */
    this.apiService_ = Services.ApiService.getInstance();

    /**
     * @const {!Services.ProjectService}
     * @private
     */
    this.projectService_ = Services.ProjectService.getInstance();

    /**
     * @const {!Element}
     * @private
     */
    this.categoryCatalogueElement_ = Utils.getElement('portfolio-category-catalogue');

    /**
     * @const {!Element}
     * @private
     */
    this.galleryElement_ = Utils.getElement('portfolio-gallery');

    this.categoryCatalogueElement_.addEventListener(
      'categoryFilterChange', Containers.GalleryContainer.updateGalleryDisplay_.bind(this)
    );

    /**
     * @const {!Element}
     * @private
     */
    this.portfolioElement_ = Utils.getElement('portfolio');

    this.portfolioElement_.addEventListener(
      'enter', Containers.GalleryContainer.onEnter_.bind(this)
    );
  }
);

/**
 * @return {void}
 */
Containers.GalleryContainer.prototype.loadCategories = (
  function () {
    /** @const {!Element} */
    var categoryCatalogue = this.categoryCatalogueElement_;

    while (categoryCatalogue.firstChild) {
      categoryCatalogue.removeChild(categoryCatalogue.firstChild);
    }

    /** @const {!Promise<!Array<!ProjectService_CategoryInterface>>} */
    var p1 = this.projectService_.getCategories();
    p1.then(
      function (/** !Array<!ProjectService_CategoryInterface> */arg1) {
        if (!Array.isArray(arg1)) {
          throw Error('');
        }

        arg1.unshift(
          /** @type {!ProjectService_CategoryInterface} */(
            {id: 0, name: 'Tous'}
          )
        );

        for (var /** number */ i = 0, /** number */ length = arg1.length ; i !== length ; ++i) {
          /**
           * @const {!ProjectService_CategoryInterface}
           */
          var item = arg1[i];

          /** @const {!WebComponents.CategoryFilterComponent} */
          var categoryFilter = /** @type {!WebComponents.CategoryFilterComponent} */(
            document.createElement('category-filter')
          );

          categoryFilter.setAttribute('category-id', item.id);
          categoryFilter.setAttribute('category-name', item.name);
          categoryCatalogue.appendChild(categoryFilter);
          categoryFilter.setChecked(true);
        }
      }
    );
  }
);

/**
 * @return {!Promise<void>}
 */
Containers.GalleryContainer.prototype.loadGallery = (
  function () {
    /** @const {!Element} */
    var gallery = this.galleryElement_;

    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }

    /** @const {!Promise<!Array<!ProjectService_WorkInterface>>} */
    var p1 = this.projectService_.getProjects();

    return (
      p1.then(
        function (/** !Array<!ProjectService_WorkInterface> */arg1) {
          if (!Array.isArray(arg1)) {
            throw Error('');
          }
          //console.log('this.projectService_', this.projectService_.getProjectCount());

          for (var /** number */ i = 0, /** number */ length = arg1.length ; i !== length ; ++i) {
            /**
             * @const {!ProjectService_WorkInterface}
             */
            var item = arg1[i];

            //console.log(
            //  item.id,
            //  item.title,
            //  item.imageUrl,
            //  item.categoryId,
            //  item.userId,
            //  item.category && item.category.id,
            //  item.category && item.category.name
            //);

            /** @const {!Services.ProjectService.EntryItem} */
            var entryItem = this.projectService_.createEntryItem(item);

            /** @const {!WebComponents.GalleryItemComponent} */
            var galleryItemElement = /** @type {!WebComponents.GalleryItemComponent} */(
              entryItem.galleryItemElement
            );

            gallery.appendChild(galleryItemElement);
          }
        }.bind(this)
      )
    );
  }
);

/**
 * @this {!Containers.GalleryContainer}
 * @param {!Event} event
 * @return {void}
 * @private
 */
Containers.GalleryContainer.onEnter_ = (
  function (event) {
    var /** !NodeList<!Node> */ nodes;
    var /** !Node */ node;
    var /** @type {number} */ i;
    var /** @type {number} */ n;

    /** @const {!Element} */
    var categoryCatalogue = this.categoryCatalogueElement_;

    /** @const {!Array<number>} */
    var displayedCategories = [];

    if (this.apiService_.isLoggedIn()) {
      displayedCategories[displayedCategories.length] = 0;
    }
    else {
      nodes = categoryCatalogue.childNodes;
      for (i = 0, n = nodes.length ; i !== n ; ++i) {
        node = nodes[i];
        if (Node.ELEMENT_NODE === node.nodeType) {
          /** @const {!WebComponents.CategoryFilterComponent} */
          var categoryFilter = /** @type {!WebComponents.CategoryFilterComponent} */(node);

          if (categoryFilter.isChecked()) {
            displayedCategories[displayedCategories.length] = categoryFilter.getCategoryId();
          }
        }
      }
    }

    n = this.projectService_.getEntryItemCount();
    for (i = 0 ; i !== n ; i++) {
      /** @const {!Services.ProjectService.EntryItem} */
      var entryItem = /** @type {!Services.ProjectService.EntryItem} */(
        this.projectService_.getEntryItem(i)
      );

      /** @const {!WebComponents.GalleryItemComponent} */
      var galleryItemElement = /** @type {!WebComponents.GalleryItemComponent} */(
        entryItem.galleryItemElement
      );

      /** @const {number} */
      var categoryId = galleryItemElement.getCategoryId();

      if (-1 !== displayedCategories.indexOf(0) || -1 !== displayedCategories.indexOf(categoryId)) {
        galleryItemElement.style.display = '';
      }
      else {
        galleryItemElement.style.display = 'none';
      }
    }
  }
);

/**
 * @this {!Containers.GalleryContainer}
 * @param {!Event} event
 * @return {void}
 * @private
 */
Containers.GalleryContainer.updateGalleryDisplay_ = (
  function (event) {
    event.stopPropagation();

    /** @const {!CustomEvent<!WebComponents.CategoryFilterComponent>} */
    var customEvent = /** @type {!CustomEvent<!WebComponents.CategoryFilterComponent>} */(event);

    /** @const {!Element} */
    var categoryCatalogue = this.categoryCatalogueElement_;


    /** @const {!WebComponents.CategoryFilterComponent} */
    var currentCategoryFilter = customEvent.detail;

    /** @const {boolean} */
    var isDefaultCategory = 0 === currentCategoryFilter.getCategoryId();

    /** @type {boolean} */
    var areAllCategoriesChecked = true;


    /** @const {!Array<number>} */
    var displayedCategories = [];

    /** @const {!Array<!WebComponents.CategoryFilterComponent>} */
    var categoryFilters = [];

    /** @type {!WebComponents.CategoryFilterComponent} */
    var categoryFilter;

    /** @const {!NodeList<!Node>} */
    var nodes = categoryCatalogue.childNodes;

    var /** !Node */ node;
    for (var /** @type {number} */ i = 0, /** @type {number} */ n = nodes.length ; i !== n ; ++i) {
      node = nodes[i];
      if (Node.ELEMENT_NODE === node.nodeType) {
        categoryFilter = /** @type {!WebComponents.CategoryFilterComponent} */(node);
        categoryFilters[categoryFilters.length] = categoryFilter;
        if (0 !== categoryFilter.getCategoryId()) {
          areAllCategoriesChecked = categoryFilter.isChecked() ? areAllCategoriesChecked : false;
        }
      }
    }

    for (i = 0, n = categoryFilters.length ; i !== n ; ++i) {
      categoryFilter = categoryFilters[i];

      if (isDefaultCategory) {
        if (categoryFilter !== currentCategoryFilter) {
          categoryFilter.setChecked(currentCategoryFilter.isChecked());
        }
      }
      else if (0 === categoryFilter.getCategoryId()) {
        if (!currentCategoryFilter.isChecked()) {
          categoryFilter.setChecked(false);
        }
        else if (areAllCategoriesChecked) {
          categoryFilter.setChecked(true);
        }
      }

      if (categoryFilter.isChecked()) {
        displayedCategories[displayedCategories.length] = categoryFilter.getCategoryId();
      }
    }

    n = this.projectService_.getEntryItemCount();
    for (i = 0 ; i !== n ; i++) {
      /** @const {!Services.ProjectService.EntryItem} */
      var entryItem = /** @type {!Services.ProjectService.EntryItem} */(
        this.projectService_.getEntryItem(i)
      );

      /** @const {!WebComponents.GalleryItemComponent} */
      var galleryItemElement = /** @type {!WebComponents.GalleryItemComponent} */(
        entryItem.galleryItemElement
      );

      /** @const {number} */
      var categoryId = galleryItemElement.getCategoryId();

      if (-1 !== displayedCategories.indexOf(categoryId)) {
        galleryItemElement.style.display = '';
      }
      else {
        galleryItemElement.style.display = 'none';
      }
    }
  }
);
