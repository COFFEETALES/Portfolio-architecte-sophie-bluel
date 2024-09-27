// vim: set tabstop=2 shiftwidth=2 expandtab :
'use strict';

/** @const {function():!Window} */
var me_ = function() { return /** @type {!Window} */(self); };

/** @const {function():void} */
var nullFunction = function() {};

/** @const {function(string):!Element} */
var getElement = function(str) {
  var /** !Element */ el = /** @type{!Element} */(document.getElementById(str));
  return el;
};
