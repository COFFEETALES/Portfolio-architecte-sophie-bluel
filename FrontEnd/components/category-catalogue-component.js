// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 */
var CategoryCatalogueComponent = (
  function () {
    /**
     * @const {!ProjectService}
     */
    this.projectService = ProjectService.getInstance();
  }
);

/**
 * @return {void}
 */
CategoryCatalogueComponent.prototype.loadCategories = (
  function () {
    /** @const {!Promise<!Array<!ProjectService_CategoryInterface>>} */
    var p1 = this.projectService.getCategories();
    p1.then(
      function (/** !Array<!ProjectService_CategoryInterface> */arg1) {
        if (!Array.isArray(arg1)) {
          throw Error('');
        }
        //console.log('this.projectService', this.projectService.getProjectCount());

        /** @const {!Element} */
        var categoryCatalogue = getElement('portfolio-category-catalogue');

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

          /** @const {!Element} */
          var categoryFilter = document.createElement('category-filter');
          categoryFilter.setAttribute('id', item.id);
          categoryFilter.setAttribute('name', item.name);
          categoryCatalogue.appendChild(categoryFilter);

          console.log(item);
        }
      }
    );
  }
);

/**
 * @type {!CategoryCatalogueComponent|void}
 * @private
 */
CategoryCatalogueComponent.instance_;

/**
 * @return {!CategoryCatalogueComponent}
 */
CategoryCatalogueComponent.getInstance = (
  function () {
    return CategoryCatalogueComponent.instance_ || (CategoryCatalogueComponent.instance_ = new CategoryCatalogueComponent);
  }
);
