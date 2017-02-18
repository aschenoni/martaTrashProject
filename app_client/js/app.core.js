'use strict';

/* global angular */

/**
 * Include any Angular.js core librairies inside this module
 */
(function() {
  angular
    .module('app.core', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute'
    ]);
})();