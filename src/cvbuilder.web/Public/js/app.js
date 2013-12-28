/*! 2013-12-28 */
"use strict";

angular.module("cvbuilder.routes", [ "ngRoute" ]).config([ "$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.when("/", {
        templateUrl: "/public/views/home/frontpage.html"
    }).when("/about", {
        templateUrl: "/public/views/home/about.html"
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
    }).when("/dashboard", {
        templateUrl: "/public/views/protected/dashboard.html"
    }).otherwise({
        redirectTo: "/"
    });
} ]), angular.module("cvbuilder.config", []).factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "$location", "cache", "accountService", function(a, b, c, d) {
    a.login = function(a) {
        d.login(a.username, a.password).then(function(a) {
            a && b.path("/dashboard");
        }), function() {};
    };
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
                //if (userService != null && userService.token != null && userService.IsAuthenticated) {
                //    config.headers["Authorization"] = 'Session ' + userService.Token;
                //}
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
} ]), angular.module("cvbuilder.directives").directive("message", [ "messageService", function(a) {
    return {
        restrict: "E",
        controller: [ "$rootScope", "$scope", function(b, c) {
            c.$on("handleMessageBroadcast", function() {
                b.messages = a.getItems();
            });
        } ],
        replace: !0,
        template: '<div ng-repeat="item in messages">{{item.content}}</div>'
    };
} ]), angular.module("cvbuilder.directives").directive("user", [ "accountService", function(a) {
    return {
        restrict: "AE",
        scope: {
            ngModel: "="
        },
        controller: [ "$scope", function(b) {
            b.user = a.user, console.log(b.user);
        } ],
        replace: !0,
        templateUrl: "/public/views/protected/partials/user.html"
    };
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").factory("accountService", [ "$http", "$location", "base64", "messageService", function(a, b, c, d) {
    var e = {
        IsAuthenticated: !1,
        Username: "",
        Token: "",
        TokenExpiry: "",
        FullName: "",
        Photo: ""
    }, f = function() {
        return a.get("/api/account").then(function(a) {
            e.FullName = a.data.name, e.Photo = a.data.photo;
        }), function(a) {
            d.add(a.status);
        };
    };
    return {
        user: e,
        register: function() {},
        login: function(b, g) {
            return a.defaults.headers.common.Authorization = "Basic " + c.encode(b + ":" + g), 
            a.post("/api/authenticate").then(function(b) {
                //make sure that all future requests are done with the Session token
                return e.IsAuthenticated = null != b.data.access_token, e.IsAuthenticated && (e.Token = b.data.access_token, 
                e.TokenExpiry = b.data.expires_in, a.defaults.headers.common.Authorization = "Session " + e.Token, 
                e.FullName = "MEMEME", f()), e.IsAuthenticated;
            }, function(a) {
                //error
                401 === a.status && d.add("Hello World");
            });
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
}), angular.module("cvbuilder.services").factory("messageService", [ "$rootScope", function(a) {
    var b = [];
    return {
        add: function(c, d, e, f) {
            b.push({
                content: c,
                title: d,
                type: e,
                preserve: f
            }), a.$broadcast("handleMessageBroadcast");
        },
        getItems: function() {
            return b.slice();
        },
        clear: function() {
            b = [], a.$broadcast("handleMessageBroadcast");
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