/*! 2013-12-26 */
"use strict";

angular.module("cvbuilder.routes", [ "ngRoute" ]).config([ "$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.when("/", {
        templateUrl: "/public/views/site/frontpage.html"
    }).when("/about", {
        templateUrl: "/public/views/site/about.html"
    }).when("/register", {
        templateUrl: "/public/views/account/register.html",
        controller: "accountController"
    }).when("/login", {
        templateUrl: "/public/views/account/login.html",
        controller: "accountController"
    }).when("/status/:code", {
        templateUrl: function(a) {
            return "/public/views/status/" + a.code + ".html";
        }
    }).otherwise({
        redirectTo: "/"
    });
} ]), angular.module("cvbuilder.config", []).factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "cache", "accountService", function(a, b, c) {
    c.login("admin", "blah").then(function(a) {
        console.log(a);
    }), function() {};
} ]), angular.module("cvbuilder.controllers").controller("versionController", [ "$scope", "cache", "versionService", function(a, b, c) {
    var d = b.get("version");
    a.version = null != d ? d : c.getVersion().then(function(c) {
        a.version = c, b.put("version", c);
    });
} ]), angular.module("cvbuilder.interceptors", []), angular.module("cvbuilder.interceptors").config([ "$provide", "$httpProvider", function(a, b) {
    // Intercept http calls.
    a.factory("HttpInterceptor", [ "$q", "$location", function(a, b) {
        return {
            // On request success
            request: function(b) {
                // Return the config or wrap it in a promise if blank.
                return b || a.when(b);
            },
            // On request failure
            requestError: function(b) {
                // Return the promise rejection.
                return a.reject(b);
            },
            // On response success
            response: function(b) {
                // Return the response or promise.
                return b || a.when(b);
            },
            // On response failture
            responseError: function(c) {
                switch (c.status) {
                  case 401:
                    b.path("/status/401");
                    break;

                  case 403:
                    b.path("/status/403");
                    break;

                  case 404:
                    b.path("/status/404");
                }
                // Return the promise rejection.
                return a.reject(c);
            }
        };
    } ]), // Add the interceptor to the $httpProvider.
    b.interceptors.push("HttpInterceptor");
} ]), angular.module("cvbuilder.filters", []), angular.module("cvbuilder.filters").filter("interpolate", [ "version", function(a) {
    return function(b) {
        return String(b).replace(/\%VERSION\%/gm, a);
    };
} ]), angular.module("cvbuilder.directives", []), angular.module("cvbuilder.directives").directive("appVersion", [ "version", function(a) {
    return function(b, c) {
        c.text(a);
    };
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").factory("accountService", [ "$http", function(a) {
    return {
        register: function() {},
        login: function(b, c) {
            var d = {
                headers: {
                    Authorization: "Basic " + Base64.encode(b + ":" + c),
                    Accept: "application/json;odata=verbose"
                }
            };
            return a.get("/api/version/token", d).then(function(a) {
                return a.token;
            }, function() {});
        }
    };
} ]), angular.module("cvbuilder.services").factory("versionService", [ "$http", function(a) {
    return {
        getVersion: function() {
            return a.get("/api/version").then(function(a) {
                return a.data.Message;
            }, function() {});
        }
    };
} ]), // Declare app level module which depends on filters, and services
angular.module("cvbuilder", [ "cvbuilder.routes", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.services", "cvbuilder.directives", "cvbuilder.interceptors", "cvbuilder.controllers", "ngRoute" ]);