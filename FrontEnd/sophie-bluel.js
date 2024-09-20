// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/**
 * @class
 * @constructor
 */
var SophieBluel = (
  function () {
    /** @const {GalleryComponent!} */
    this.gallery = new GalleryComponent;
  }
);

window.onload = /** @const {function(Event?):void|null} */ (
  function (event) {
    new SophieBluel;
  }
);

