// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.ProjectService = (
  function () {
    /**
     * @const {!Services.ApiService}
     * @private
     */
    this.apiService_ = Services.ApiService.getInstance();

    /**
     * @const {!Array<!Services.ProjectService.EntryItem>}
     * @private
     */
    this.dataStore_ = [];
  }
);

/**
 * @typedef {
 *   {
 *     itemId: number,
 *     itemCategoryId: number,
 *     galleryItemElement: !HTMLElement,
 *     galleryEditItemElement: !HTMLElement
 *   }
 * }
 * @private
 */
Services.ProjectService.EntryItem;

/**
 * @type {number}
 * @private
 */
Services.ProjectService.prototype.numProjects_ = 0;

/**
 * @return {!Services.ProjectService.EntryItem|void}
 * @param {number} id
 */
Services.ProjectService.prototype.findEntryItem = (
  function (id) {
    /** @const {number} */
    var n = this.dataStore_.length;

    for (var /** number */ i = 0 ; i !== n ; i++) {
      if (id === this.dataStore_[i].itemId) {
        return this.dataStore_[i];
      }
    }
  }
);

/**
 * @return {!Services.ProjectService.EntryItem|void}
 * @param {number} id
 */
Services.ProjectService.prototype.deleteEntryItem = (
  function (id) {
    /** @const {number} */
    var n = this.dataStore_.length;

    for (var /** number */ i = 0 ; i !== n ; i++) {
      if (id === this.dataStore_[i].itemId) {
        return this.dataStore_.splice(i, 1)[0];
      }
    }
  }
);

/**
 * @return {!Services.ProjectService.EntryItem|void}
 * @param {number} id
 */
Services.ProjectService.prototype.getEntryItem = (
  function (id) {
    return this.dataStore_[id];
  }
);

/**
 * @return {number}
 */
Services.ProjectService.prototype.getEntryItemCount = (
  function () {
    return this.dataStore_.length;
  }
);

/**
 * @return {!Services.ProjectService.EntryItem}
 * @param {!ProjectService_WorkInterface|!ProjectService_PostWorkInterface} work
 */
Services.ProjectService.prototype.createEntryItem = (
  function (work) {
    /** @const {!HTMLElement} */
    var galleryItemElement = /** @type {!HTMLElement} */(
      document.createElement('gallery-item')
    );
    galleryItemElement.setAttribute('gallery-item-id', work.id);
    galleryItemElement.setAttribute('gallery-item-category-id', work.categoryId);
    galleryItemElement.setAttribute('gallery-item-title', work.title);
    galleryItemElement.setAttribute('gallery-item-imageurl', work.imageUrl);

    /** @const {!HTMLElement} */
    var galleryEditItemElement = /** @type {!HTMLElement} */(
      document.createElement('gallery-edit-item')
    );
    galleryEditItemElement.setAttribute('gallery-edit-item-id', work.id);
    galleryEditItemElement.setAttribute('gallery-edit-item-category-id', work.categoryId);
    galleryEditItemElement.setAttribute('gallery-edit-item-title', work.title);
    galleryEditItemElement.setAttribute('gallery-edit-item-imageurl', work.imageUrl);

    /** @const {!Services.ProjectService.EntryItem} */
    var entryItem = {
      itemId: work.id,
      itemCategoryId: work.categoryId,
      galleryItemElement: galleryItemElement,
      galleryEditItemElement: galleryEditItemElement
    };

    return (
      this.dataStore_[this.dataStore_.length] = entryItem
    );
  }
);

/**
 * @return {number}
 */
Services.ProjectService.prototype.getProjectCount = (
  function () {
    return this.numProjects_;
  }
);

/**
 * @this {!Services.ProjectService}
 * @param {!Array<!ProjectService_WorkInterface>} arg1
 * @return {
 *  !Array<
 *   !ProjectService_WorkInterface
 *  >
 * }
 * @private
 */
Services.ProjectService.processJson_ = (
  function (arg1) {
    if (!Array.isArray(arg1)) {
      throw Error('');
    }
    this.numProjects_ = arg1.length;
    return arg1;
  }
);

/**
 * @return {
 *  !Promise<
 *   !Array<
 *    !ProjectService_CategoryInterface
 *   >
 *  >
 * }
 */
Services.ProjectService.prototype.getCategories = (
  function () {
    return (
      this.apiService_.request('GET', HttpEndpoints.GET_CATEGORIES).then(
        function (response) {
          return response.json();
        }
      )
    );
  }
);

/**
 * @return {
 *  !Promise<
 *   !ProjectService_PostWorkInterface
 *  >
 * }
 * @param {string} image
 * @param {string} title
 * @param {number} category
 */
Services.ProjectService.prototype.postWorks = (
  function (image, title, category) {
    /** @const {!FormData} */
    var formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', category.toString(10));

    return (
      this.apiService_.request(
        'POST', HttpEndpoints.POST_WORKS, formData
      ).then(
        function (response) {
          if (response.ok) {
            return response.json();
          }
          throw Error(
            ['[', response.status, ']', ' ', response.statusText].join('')
          );
        }
      )
    );
  }
);

/**
 * @return {
 *  !Promise<
 *   void
 *  >
 * }
 * @param {number} id
 */
Services.ProjectService.prototype.deleteWorks = (
  function (id) {
    return (
      this.apiService_.request('DELETE', [HttpEndpoints.DELETE_WORKS, id].join('/')).then(
        function (response) {
          if (response.ok) {
            return;
          }
          throw Error(
            ['[', response.status, ']', ' ', response.statusText].join('')
          );
        }
      )
    );
  }
);

/**
 * @return {
 *  !Promise<
 *   !Array<
 *    !ProjectService_WorkInterface
 *   >
 *  >
 * }
 */
Services.ProjectService.prototype.getProjects = (
  function () {
    return (
      this.apiService_.request('GET', HttpEndpoints.GET_WORKS).then(
        function (response) {
          return response.json();
        }
      ).then(
        Services.ProjectService.processJson_.bind(this)
      )
    );
//    /**
//     * @const {!ProjectService_WorkInterface}
//     */
//    var faultyWork = {
//      id: 1,
//      title: 'title',
//    };
//    return Promise.resolve([faultyWork]);
  }
);

/**
 * @type {!Services.ProjectService|void}
 * @private
 */
Services.ProjectService.instance_;

/**
 * @return {!Services.ProjectService}
 */
Services.ProjectService.getInstance = (
  function () {
    return Services.ProjectService.instance_ || (Services.ProjectService.instance_ = new Services.ProjectService);
  }
);
