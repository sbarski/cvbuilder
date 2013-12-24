'use strict';

// Declare app level module which depends on filters, and services
angular.module('cvbuilder', [
    'ngRoute',
    'cvbuilder.routes',
    'cvbuilder.config',
    'cvbuilder.filters',
    'cvbuilder.services',
    'cvbuilder.directives',
    'cvbuilder.controllers'
]);