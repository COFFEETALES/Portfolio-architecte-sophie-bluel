// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Containers.CategoryCatalogueContainer = (
  function () {
    /**
     * @const {!Services.ProjectService}
     */
    this.projectService = Services.ProjectService.getInstance();
  }
);

/**
 * @return {void}
 */
Containers.CategoryCatalogueContainer.prototype.loadCategories = (
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
        var categoryCatalogue = Utils.getElement('portfolio-category-catalogue');

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
 * @type {!Containers.CategoryCatalogueContainer|void}
 * @private
 */
Containers.CategoryCatalogueContainer.instance_;

/**
 * @return {!Containers.CategoryCatalogueContainer}
 */
Containers.CategoryCatalogueContainer.getInstance = (
  function () {
    return Containers.CategoryCatalogueContainer.instance_ || (Containers.CategoryCatalogueContainer.instance_ = new Containers.CategoryCatalogueContainer);
  }
);
