'use strict';

/* global angular */

(function() {
  angular
    .module('app', [
      'app.core',

      /**
       * App modules
       */
      'app.controllers',
      'app.directives',
      'app.filters',
      'app.services'
    ]);
})();