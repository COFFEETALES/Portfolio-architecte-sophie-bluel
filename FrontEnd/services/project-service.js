// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 * @private
 */
var ProjectService = (
  function () {
  }
);


/**
 * @type {number}
 * @private
 */
ProjectService.prototype.numProjects_ = 0;

/**
 * @return {number}
 */
ProjectService.prototype.getProjectCount = (
  function () {
    return this.numProjects_;
  }
);

/**
 * @this {!ProjectService}
 * @param {!Array<!ProjectService_WorkInterface>} arg1
 * @return {
 *  !Array<
 *   !ProjectService_WorkInterface
 *  >
 * }
 * @private
 */
ProjectService.processJson_ = (
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
ProjectService.prototype.getCategories = (
  function () {
    return (
      fetch(
        HttpEndpoints.GET_CATEGORIES, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          //mode: 'no-cors',
          credentials: 'same-origin',
          cache: 'no-cache',
          redirect: 'follow',
          referrer: 'no-referrer',
          referrerPolicy: 'no-referrer',
          keepalive: false,
        }
      ).then(
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
ProjectService.prototype.getProjects = (
  function () {
    return (
      fetch(
        HttpEndpoints.GET_WORKS, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          //mode: 'no-cors',
          credentials: 'same-origin',
          cache: 'no-cache',
          redirect: 'follow',
          referrer: 'no-referrer',
          referrerPolicy: 'no-referrer',
          keepalive: false,
        }
      ).then(
        function (response) {
          return response.json();
        }
      ).then(
        ProjectService.processJson_.bind(this)
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
 * @type {!ProjectService|void}
 * @private
 */
ProjectService.instance_;

/**
 * @return {!ProjectService}
 */
ProjectService.getInstance = (
  function () {
    return ProjectService.instance_ || (ProjectService.instance_ = new ProjectService);
  }
);
