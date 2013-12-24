/*! 2013-12-24 */

"use strict";

var app = angular.module("cvbuilder.config", []);

app.factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("myApp.controllers", []).controller("MyCtrl1", [ function() {} ]).controller("MyCtrl2", [ function() {} ]), 
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
} ]), angular.module("myApp.services", []).value("version", "0.1"), angular.module("cvbuilder.services", []).factory("versionService", [ "$http", function(a) {
    return {
        getVersion: function() {
            return a.get("/api/version").then(function(a) {
                return a.data.Message;
            }, function() {});
        }
    };
} ]), angular.module("cvbuilder", [ "ngRoute", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.services", "cvbuilder.directives", "cvbuilder.controllers" ]).config([ "$routeProvider", function() {} ]);
//# sourceMappingURL=src/cvbuilder.web/public/js/app.js.map