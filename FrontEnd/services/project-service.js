// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
Services.ProjectService = (
  function () {
    /** @const {!Services.ApiService} */
    this.apiService = Services.ApiService.getInstance();
  }
);


/**
 * @type {number}
 * @private
 */
Services.ProjectService.prototype.numProjects_ = 0;

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
      (this.apiService.request('GET', HttpEndpoints.GET_CATEGORIES)).then(
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
 *   !Array<
 *    !ProjectService_WorkInterface
 *   >
 *  >
 * }
 */
Services.ProjectService.prototype.getProjects = (
  function () {
    return (
      (this.apiService.request('GET', HttpEndpoints.GET_WORKS)).then(
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
