/*! 2013-12-24 */
"use strict";

angular.module("cvbuilder.routes", []).config([ "$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.when("/", {
        templateUrl: "/public/views/site/frontpage.html"
    }).when("/about", {
        templateUrl: "/public/views/site/about.html"
    }).when("/register", {
        templateUrl: "/public/views/account/register.html",
        controller: "accountController"
    }).otherwise({
        redirectTo: "/"
    });
} ]);

var app = angular.module("cvbuilder.config", []);

app.factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("cvbuilder.controllers", []).controller("accountController", [ "$scope", "cache", "accountService", function() {} ]), 
angular.module("cvbuilder.controllers", []).controller("versionController", [ "$scope", "cache", "versionService", function(a, b, c) {
    var d = b.get("version");
    a.version = null != d ? d : c.getVersion().then(function(c) {
        a.version = c, b.put("version", c);
    });
} ]), angular.module("cvbuilder.filters", []).filter("interpolate", [ "version", function(a) {
    return function(b) {
        return String(b).replace(/\%VERSION\%/gm, a);
    };
} ]), angular.module("cvbuilder.directives", []).directive("appVersion", [ "version", function(a) {
    return function(b, c) {
        c.text(a);
    };
} ]), angular.module("cvbuilder.services", []).factory("accountService", [ "$http", function() {
    return {
        register: function() {},
        login: function() {}
    };
} ]), angular.module("cvbuilder.services", []).factory("versionService", [ "$http", function(a) {
    return {
        getVersion: function() {
            return a.get("/api/version").then(function(a) {
                return a.data.Message;
            }, function() {});
        }
    };
} ]), angular.module("cvbuilder", [ "ngRoute", "cvbuilder.routes", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.services", "cvbuilder.directives", "cvbuilder.controllers" ]);