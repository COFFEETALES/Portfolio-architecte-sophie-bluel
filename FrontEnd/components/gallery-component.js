// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 */
var GalleryComponent = (
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
GalleryComponent.prototype.loadGallery = (
  function () {
    /** @const {!Promise<!Array<!ProjectService_WorkInterface>>} */
    var p1 = this.projectService.getProjects();
    p1.then(
      function (/** !Array<!ProjectService_WorkInterface> */arg1) {
        if (!Array.isArray(arg1)) {
          throw Error('');
        }
        console.log('this.projectService', this.projectService.getProjectCount());
        for (var /** number */ i = 0, /** number */ length = arg1.length ; i !== length ; ++i) {
          /**
           * @const {!ProjectService_WorkInterface}
           */
          var item = arg1[i];
          console.log(
            item.id,
            item.title,
            item.imageUrl,
            item.categoryId,
            item.userId,
            item.category && item.category.id,
            item.category && item.category.name
          );
        }
      }.bind(this)
    );
  }
);
