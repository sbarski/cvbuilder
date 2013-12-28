/*! 2013-12-27 */
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
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "cache", "accountService", "userService", function(a, b, c) {
    c.login("admin", "admin").then(function() {}), function() {};
} ]), angular.module("cvbuilder.controllers").controller("versionController", [ "$scope", "cache", "versionService", function(a, b, c) {
    var d = b.get("version");
    a.version = null != d ? d : c.getVersion().then(function(c) {
        a.version = c, b.put("version", c);
    });
} ]), angular.module("cvbuilder.interceptors", []), angular.module("cvbuilder.interceptors").config([ "$provide", "$httpProvider", function(a, b) {
    // Intercept http calls.
    a.factory("HttpInterceptor", [ "$q", "$location", "userService", function(a, b, c) {
        return {
            // On request success
            request: function(b) {
                return null != c && null != c.token && c.IsAuthenticated && (b.headers.Authorization = "Session " + c.Token), 
                b || a.when(b);
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
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").factory("accountService", [ "$http", "base64", "userService", function(a, b, c) {
    return {
        register: function() {},
        login: function(d, e) {
            //will only be present in this scope
            return a.defaults.headers.common.Authorization = "Basic " + b.encode(d + ":" + e), 
            a.post("/api/authenticate").then(function(a) {
                //make sure that all future requests are done with the Session token
                return c.IsAuthenticated = null != a.data.access_token, c.Token = a.data.access_token, 
                c.TokenExpiry = a.data.expires_in, c.IsAuthenticated;
            }, function() {});
        }
    };
} ]), angular.module("cvbuilder.services").factory("base64", function() {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return {
        encode: function(b) {
            var c, d, e, f, g, h = "", i = "", j = "", k = 0;
            do c = b.charCodeAt(k++), d = b.charCodeAt(k++), i = b.charCodeAt(k++), e = c >> 2, 
            f = (3 & c) << 4 | d >> 4, g = (15 & d) << 2 | i >> 6, j = 63 & i, isNaN(d) ? g = j = 64 : isNaN(i) && (j = 64), 
            h = h + a.charAt(e) + a.charAt(f) + a.charAt(g) + a.charAt(j), c = d = i = "", e = f = g = j = ""; while (k < b.length);
            return h;
        },
        decode: function(b) {
            var c, d, e, f, g, h = "", i = "", j = "", k = 0, l = /[^A-Za-z0-9\+\/\=]/g;
            l.exec(b) && alert("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."), 
            b = b.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do e = a.indexOf(b.charAt(k++)), f = a.indexOf(b.charAt(k++)), g = a.indexOf(b.charAt(k++)), 
            j = a.indexOf(b.charAt(k++)), c = e << 2 | f >> 4, d = (15 & f) << 4 | g >> 2, i = (3 & g) << 6 | j, 
            h += String.fromCharCode(c), 64 != g && (h += String.fromCharCode(d)), 64 != j && (h += String.fromCharCode(i)), 
            c = d = i = "", e = f = g = j = ""; while (k < b.length);
            return h;
        }
    };
}), angular.module("cvbuilder.services").factory("userService", [ function() {
    var a = {
        IsAuthenticated: !1,
        Username: "",
        Token: "",
        TokenExpiry: ""
    };
    return a;
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