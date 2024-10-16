// vim: set ft=javascript tabstop=3 shiftwidth=3 expandtab :
/** @externs */

/**
 * @typedef {
 *  {
 *   id: number,
 *   name: string
 *  }
 * }
 */
var ProjectService_CategoryInterface;

/**
* @typedef {
*  {
*   id: number,
*   title: string,
*   imageUrl: string,
*   categoryId: number,
*   userId: number,
*   category: ?ProjectService_CategoryInterface
*  }
* }
*/
var ProjectService_WorkInterface;

/**
* @typedef {
*  {
*   id: number,
*   title: string,
*   imageUrl: string,
*   categoryId: number
*  }
* }
*/
var ProjectService_PostWorkInterface;

