// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Containers.GalleryContainer = (
  function () {
    if (Containers.GalleryContainer.instance_) {
      throw Error('An instance of Containers.GalleryContainer already exists.');
    }

    /** @const {!Services.ProjectService} */
    this.projectService = Services.ProjectService.getInstance();

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
  }
);

/**
 * @return {void}
 */
Containers.GalleryContainer.prototype.loadCategories = (
  function () {
    /** @const {!Element} */
    var categoryCatalogue = this.categoryCatalogueElement_;

    /** @const {!Promise<!Array<!ProjectService_CategoryInterface>>} */
    var p1 = this.projectService.getCategories();
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

          categoryFilter.setAttribute('categoryId', item.id);
          categoryFilter.setAttribute('categoryName', item.name);
          categoryCatalogue.appendChild(categoryFilter);
          categoryFilter.setChecked(true);
        }
      }
    );
  }
);

/**
 * @return {void}
 */
Containers.GalleryContainer.prototype.loadGallery = (
  function () {
    /** @const {!Element} */
    var gallery = this.galleryElement_;

    /** @const {!Promise<!Array<!ProjectService_WorkInterface>>} */
    var p1 = this.projectService.getProjects();
    p1.then(
      function (/** !Array<!ProjectService_WorkInterface> */arg1) {
        if (!Array.isArray(arg1)) {
          throw Error('');
        }
        //console.log('this.projectService', this.projectService.getProjectCount());

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

          /** @const {!Element} */
          var galleryItem = document.createElement('gallery-item');
          galleryItem.setAttribute('galleryItemId', item.id);
          galleryItem.setAttribute('galleryItemCategoryId', item.categoryId);
          galleryItem.setAttribute('galleryItemTitle', item.title);
          galleryItem.setAttribute('galleryItemImageUrl', item.imageUrl);
          gallery.appendChild(galleryItem);
        }
      }.bind(this)
    );
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
    event.stopImmediatePropagation();

    /** @const {!CustomEvent<!WebComponents.CategoryFilterComponent>} */
    var customEvent = /** @type {!CustomEvent<!WebComponents.CategoryFilterComponent>} */(event);

    /** @const {!Element} */
    var categoryCatalogue = this.categoryCatalogueElement_;

    /** @const {!Element} */
    var gallery = this.galleryElement_;


    /** @const {!WebComponents.CategoryFilterComponent} */
    var currentCategoryFilter = customEvent.detail;

    /** @const {boolean} */
    var isDefaultCategory = 0 === currentCategoryFilter.itemCategoryId;

    /** @type {boolean} */
    var areAllCategoriesChecked = true;


    /** @const {!Array<number>} */
    var displayedCategories = [];

    /** @const {!Array<!WebComponents.CategoryFilterComponent>} */
    var categoryFilters = [];

    /** @type {!WebComponents.CategoryFilterComponent} */
    var categoryFilter;

    var /** !NodeList<!Node> */ nodes = categoryCatalogue.childNodes;
    var /** !Node */ node;
    for (var /** @type {number} */ i = 0, /** @type {number} */ n = nodes.length ; i !== n ; ++i) {
      node = nodes[i];
      if (Node.ELEMENT_NODE === node.nodeType) {
        categoryFilter = /** @type {!WebComponents.CategoryFilterComponent} */(node);
        categoryFilters[categoryFilters.length] = categoryFilter;
        if (0 !== categoryFilter.itemCategoryId) {
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
      else if (0 === categoryFilter.itemCategoryId) {
        if (!currentCategoryFilter.isChecked()) {
          categoryFilter.setChecked(false);
        }
        else if (areAllCategoriesChecked) {
          categoryFilter.setChecked(true);
        }
      }

      if (categoryFilter.isChecked()) {
        displayedCategories[displayedCategories.length] = categoryFilter.itemCategoryId;
      }
    }

    nodes = gallery.childNodes;
    for (i = 0, n = nodes.length ; i !== n ; ++i) {
      node = nodes[i];
      if (Node.ELEMENT_NODE === node.nodeType) {
        /** @const {!WebComponents.GalleryItemComponent} */
        var galleryItem = /** @type {!WebComponents.GalleryItemComponent} */(node);

        /** @const {number} */
        var categoryId = galleryItem.itemCategoryId;

        if (-1 !== displayedCategories.indexOf(categoryId)) {
          galleryItem.style.display = '';
        }
        else {
          galleryItem.style.display = 'none';
        }
      }
    }
  }
);

/**
 * @type {!Containers.GalleryContainer|void}
 * @private
 */
Containers.GalleryContainer.instance_;

/**
 * @return {!Containers.GalleryContainer}
 */
Containers.GalleryContainer.getInstance = (
  function () {
    return Containers.GalleryContainer.instance_ || (Containers.GalleryContainer.instance_ = new Containers.GalleryContainer);
  }
);
