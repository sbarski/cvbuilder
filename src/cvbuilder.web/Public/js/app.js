/*! 2013-12-31 */
"use strict";

angular.module("cvbuilder.routes", [ "ngRoute" ]).config([ "$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.when("/", {
        templateUrl: "/public/views/home/frontpage.html"
    }).when("/about", {
        templateUrl: "/public/views/home/about.html"
    }).when("/register", {
        templateUrl: "/public/views/home/register.html",
        controller: "registerController"
    }).when("/login", {
        templateUrl: "/public/views/home/login.html",
        controller: "loginController"
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
    }).when("/account", {
        templateUrl: "public/views/protected/account/manage.html",
        data: {
            authenticated: !0
        },
        controller: "accountController"
    }).otherwise({
        redirectTo: "/"
    });
} ]), angular.module("cvbuilder.config", []).factory("cache", [ "$cacheFactory", function(a) {
    var b = a("cvbuilder-cache");
    return b;
} ]), angular.module("cvbuilder.config").run([ "$rootScope", "$location", "$q", "accountService", "messageService", function(a, b, c, d, e) {
    var f = function(a) {
        return a.data && a.data.authenticated;
    }, g = function(a) {
        return a.data && a.data.claims && a.data.claims.length > 0;
    };
    a.$on("$routeChangeStart", function(a, h) {
        //detect logout
        c.when(d.restore()).then(function() {
            if (//this doesn't need to be async for now but will help in the future
            "/login" === h.$$route.originalPath && d.user().is_authenticated && b.path("/dashboard"), 
            f(h) && !d.user().is_authenticated && (e.addAlert("Sorry - but you must be authenticated", !0), 
            b.path("/login")), g(h)) {
                var a = _.find(d.user().details.claims, function(a) {
                    return _.find(h.data.claims, function(b) {
                        return b.resource === a.resource && b.action === a.action;
                    });
                });
                a && 0 !== a.length || (e.addAlert("Sorry - but you do not have the right permissions to access this resource", !0), 
                b.path("/login"));
            }
        });
    });
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "$location", "cache", "messageService", "accountService", function() {} ]), 
angular.module("cvbuilder.controllers").controller("loginController", [ "$scope", "$location", "cache", "messageService", "accountService", function(a, b, c, d, e) {
    a.login = function(a) {
        return a && a.username && a.password ? (e.login(a.username, a.password).then(function(a) {
            //authenticate 
            a && a.is_authenticated && b.path("/dashboard");
        }), void 0) : (d.clear(), d.addAlert("Please type your username and password", !1), 
        void 0);
    };
} ]), angular.module("cvbuilder.controllers").controller("registerController", [ "$scope", "$location", "cache", "messageService", "accountService", function(a, b, c, d, e) {
    a.register = function(a) {
        e.register(a.username, a.password);
    };
} ]), angular.module("cvbuilder.controllers").controller("versionController", [ "$scope", "cache", "versionService", function(a, b, c) {
    var d = b.get("version");
    a.version = null != d ? d : c.getVersion().then(function(c) {
        a.version = c, b.put("version", c);
    });
} ]), angular.module("cvbuilder.interceptors", []), angular.module("cvbuilder.interceptors").config([ "$provide", "$httpProvider", function(a, b) {
    // Intercept http calls.
    a.factory("HttpInterceptor", [ "$rootScope", "$q", "$location", "messageService", function(a, b, c, d) {
        return {
            // On request success
            request: function(a) {
                //if (userService != null && userService.token != null && userService.IsAuthenticated) {
                //    config.headers["Authorization"] = 'Session ' + userService.Token;
                //}
                return a || b.when(a);
            },
            // On request failure
            requestError: function(a) {
                // Return the promise rejection.
                return b.reject(a);
            },
            // On response success
            response: function(a) {
                // Return the response or promise.
                return a || b.when(a);
            },
            // On response failure
            responseError: function(e) {
                switch (e.status) {
                  case 403:
                    d.addAlert("Sorry - you are forbidden to access this resource", !0), c.path("/status/403");
                    break;

                  case 404:
                    d.addAlert("Sorry - this page wasn't found", !0), c.path("/status/404");
                    break;

                  case 406:
                    //re-validate again
                    a.$broadcast("logout"), d.addAlert("Sorry - you have been signed out. Please login again.", !0), 
                    c.path("/login");
                }
                // Return the promise rejection.
                return b.reject(e);
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
} ]), angular.module("cvbuilder.directives").directive("user", [ "$location", "accountService", function(a, b) {
    return {
        restrict: "AE",
        scope: {
            ngModel: "="
        },
        controller: [ "$scope", function(c) {
            c.user = b.user().details, c.logout = function() {
                b.logout(), c.user = {}, a.path("/");
            };
        } ],
        replace: !0,
        templateUrl: "/public/views/protected/partials/user.html",
        link: function() {}
    };
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").service("accountService", [ "$rootScope", "$http", "$location", "$q", "$cookieStore", "base64", "messageService", function(a, b, c, d, e, f, g) {
    var h = function() {
        return {
            create: function() {
                return {
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
                };
            }
        };
    }, i = h().create(), j = function(a) {
        return i.is_authenticated = null != a.data.access_token, i.is_authenticated ? (i.token = a.data.access_token, 
        i.token_expiry = a.data.expires_in, b.defaults.headers.common.Authorization = "Session " + i.token) : d.reject("An error occurrred during authentication"), 
        i;
    }, k = function(a) {
        return i.details.first_name = a.data.first_name, //process user information
        i.details.last_name = a.data.last_name, i.details.photo = a.data.photo, i.details.claims = a.data.claims, 
        i;
    }, l = function() {
        return e.put("user-session", i), i;
    }, m = function() {
        e.remove("user-session"), b.defaults.headers.common.Authorization = "", i = h().create();
    };
    return a.$on("logout", function() {
        m();
    }), {
        user: function() {
            return i;
        },
        logout: function() {
            b.post("/api/account/logout"), m();
        },
        register: function(a, c) {
            return b.post("/api/account/register", {
                username: a,
                password: c
            }).then(function() {});
        },
        login: function(a, c) {
            return b.defaults.headers.common.Authorization = "Basic " + f.encode(a + ":" + c), 
            b.post("/api/authenticate").then(function(a) {
                return j(a);
            }).then(function() {
                return b.get("/api/account/details");
            }).then(function(a) {
                return k(a);
            }).then(function() {
                return l();
            }, function(a) {
                //error
                401 === a.status && g.addAlert("Unauthorized Login", !1);
            });
        },
        restore: function() {
            if (i.is_authenticated) return !0;
            var a = d.defer(), c = e.get("user-session");
            return c && (i = c, b.defaults.headers.common.Authorization = "Session " + i.token), 
            a && a.resolve(), a.promise;
        }
    };
} ]), angular.module("cvbuilder.services").service("base64", function() {
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
}), angular.module("cvbuilder.services").service("messageService", [ "$rootScope", function(a) {
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
} ]), angular.module("cvbuilder.services").service("versionService", [ "$http", function(a) {
    return {
        getVersion: function() {
            return console.log("get version"), a.get("/api/version").then(function(a) {
                return a.data.Message;
            }, function() {});
        }
    };
} ]), // Declare app level module which depends on filters, and services
angular.module("cvbuilder", [ "cvbuilder.services", "cvbuilder.routes", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.directives", "cvbuilder.interceptors", "cvbuilder.controllers", "ngRoute", "ngCookies" ]);