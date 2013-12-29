/*! 2013-12-29 */
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
        },
        data: {
            authenticated: !0
        }
    }).when("/dashboard", {
        templateUrl: "/public/views/protected/dashboard.html",
        data: {
            authenticated: !0,
            claims: [ {
                action: "access",
                resource: "dashboard"
            } ]
        }
    }).otherwise({
        redirectTo: "/"
    });
} ]), angular.module("cvbuilder.config", []).factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("cvbuilder.config").run([ "$rootScope", "$location", "accountService", "messageService", function(a, b, c, d) {
    var e = function(a) {
        return a.data && a.data.authenticated;
    }, f = function(a) {
        return a.data && a.data.claims && a.data.claims.length > 0;
    };
    a.$on("$routeChangeStart", function(a, g) {
        // if route requires auth and user is not logged in
        if (e(g) && !c.user.is_authenticated) return d.addAlert("Sorry - but you must be authenticated", !0), 
        b.path("/login"), void 0;
        if (f(g)) {
            var h = _.find(c.user.details.claims, function(a) {
                return _.find(g.data.claims, function(b) {
                    return b.resource === a.resource && b.action === a.action;
                });
            });
            h && 0 !== h.length || (d.addAlert("Sorry - but you do not have the right permissions to access this resource", !0), 
            b.path("/login"));
        }
    });
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "$location", "cache", "messageService", "accountService", function(a, b, c, d, e) {
    a.login = function(a) {
        return a && a.username && a.password ? (e.login(a.username, a.password).then(function(a) {
            //authenticate 
            a && a.is_authenticated && b.path("/dashboard");
        }, function() {}), void 0) : (d.clear(), d.addAlert("Please type your username and password", !1), 
        void 0);
    };
} ]), angular.module("cvbuilder.controllers").controller("versionController", [ "$scope", "cache", "versionService", function(a, b, c) {
    var d = b.get("version");
    a.version = null != d ? d : c.getVersion().then(function(c) {
        a.version = c, b.put("version", c);
    });
} ]), angular.module("cvbuilder.interceptors", []), angular.module("cvbuilder.interceptors").config([ "$provide", "$httpProvider", function(a, b) {
    // Intercept http calls.
    a.factory("HttpInterceptor", [ "$q", "$location", "messageService", function(a, b, c) {
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
            // On response failure
            responseError: function(d) {
                switch (d.status) {
                  case 403:
                    c.addAlert("Sorry - you are forbidden to access this resource", !0), b.path("/status/403");
                    break;

                  case 404:
                    c.addAlert("Sorry - this page wasn't found", !0), b.path("/status/404");
                }
                // Return the promise rejection.
                return a.reject(d);
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
} ]), angular.module("cvbuilder.directives").directive("message", [ "messageService", function() {
    return {
        restrict: "E",
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
            b.user = a.user.details;
        } ],
        replace: !0,
        templateUrl: "/public/views/protected/partials/user.html"
    };
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").factory("accountService", [ "$http", "$location", "$q", "base64", "messageService", function(a, b, c, d, e) {
    var f = {
        is_authenticated: !1,
        username: "",
        token: "",
        token_expiry: "",
        details: {
            first_name: "",
            last_name: "",
            photo: "",
            claims: []
        }
    }, g = function(b) {
        return f.is_authenticated = null != b.data.access_token, f.is_authenticated ? (f.token = b.data.access_token, 
        f.token_expiry = b.data.expires_in, a.defaults.headers.common.Authorization = "Session " + f.token) : c.reject("An error occurrred during authentication"), 
        f;
    };
    return {
        user: f,
        register: function() {},
        login: function(b, c) {
            return a.defaults.headers.common.Authorization = "Basic " + d.encode(b + ":" + c), 
            a.post("/api/authenticate").then(function(a) {
                return g(a);
            }).then(function() {
                return a.get("/api/account");
            }).then(function(a) {
                return f.details.first_name = a.data.first_name, //process user information
                f.details.last_name = a.data.last_name, f.details.photo = a.data.photo, f.details.claims = a.data.claims, 
                f;
            }, function(a) {
                //error
                401 === a.status && e.addAlert("Unauthorized Login", !1);
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
    a.messages = [];
    var b = function() {
        var b = [];
        _.each(a.messages, function(a) {
            a.preserve && (a.preserve = !1, b.push(a));
        }), a.messages = b;
    };
    return a.$on("stateChange", b), a.$on("$locationChangeSuccess", b), {
        addMessage: function(b, c, d, e) {
            a.messages.push({
                content: b,
                title: c,
                type: d,
                preserve: e
            }), a.$broadcast("handleMessageBroadcast");
        },
        addAlert: function(b, c) {
            a.messages.push({
                content: b,
                preserve: c
            }), a.$broadcast("handleMessageBroadcast");
        },
        messageTypes: function() {
            return [ "Alert", "Information" ];
        },
        clear: function() {
            a.messages = [], a.$broadcast("handleMessageBroadcast");
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
angular.module("cvbuilder", [ "cvbuilder.routes", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.services", "cvbuilder.directives", "cvbuilder.interceptors", "cvbuilder.controllers", "ngRoute", "ngCookies" ]);