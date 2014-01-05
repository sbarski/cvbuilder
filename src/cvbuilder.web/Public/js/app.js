/*! 2014-01-05 */
"use strict";

angular.module("cvbuilder.routes", [ "ngRoute" ]).config([ "$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.when("/", {
        templateUrl: "/public/views/home/frontpage.html"
    }).when("/about", {
        templateUrl: "/public/views/home/about.html"
    }).when("/register", {
        templateUrl: "/public/views/home/register.html",
        controller: "registerController"
    }).when("/login/:provider", {
        templateUrl: "/public/views/home/login.html",
        controller: "loginController"
    }).when("/oauth/:provider?", {
        templateUrl: "/public/views/home/login.html",
        controller: "oauthController"
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
} ]), angular.module("cvbuilder.config").run([ "$rootScope", "$location", "$q", "userService", "messageService", "authService", function(a, b, c, d, e, f) {
    var g = function(a) {
        return a.data && a.data.authenticated;
    }, h = function(a) {
        return a.data && a.data.claims && a.data.claims.length > 0;
    };
    a.$on("$routeChangeStart", function(a, i) {
        //detect logout
        c.when(f.restoreFromCookie()).then(function() {
            if (//this doesn't need to be async for now but will help in the future
            i.$$route && "/login" === i.$$route.originalPath && d.isAuthenticated() && b.path("/dashboard"), 
            g(i) && !d.isAuthenticated() && (e.addAlert("Sorry - but you must be authenticated", !0), 
            b.path("/login")), h(i)) {
                var a = _.find(d.user().details.claims, function(a) {
                    return _.find(i.data.claims, function(b) {
                        return b.resource === a.resource && b.action === a.action;
                    });
                });
                a && 0 !== a.length || (e.addAlert("Sorry - but you do not have the right permissions to access this resource", !0), 
                b.path("/login"));
            }
        });
    });
} ]), angular.module("cvbuilder.controllers", []), angular.module("cvbuilder.controllers").controller("accountController", [ "$scope", "$location", "cache", "messageService", "userService", function(a, b, c, d, e) {
    a.user = e.user().details, a.update = function(a, b) {
        e.update(a, b);
    }, a.delete = function(a) {
        e.delete(a);
    };
} ]), angular.module("cvbuilder.controllers").controller("loginController", [ "$rootScope", "$routeParams", "$scope", "$location", "cache", "messageService", "authService", function(a, b, c, d, e, f, g) {
    if (b.provider) switch (b.provider) {
      case "google":
        g.loginWithGoogle();
    }
    c.login = function(a) {
        g.login(a);
    };
} ]), angular.module("cvbuilder.controllers").controller("oauthController", [ "$rootScope", "$routeParams", "$scope", "$location", "cache", "messageService", "authService", function(a, b, c, d, e, f, g) {
    if (//OAUTH CONTROLLER
    console.log("oauth"), b.provider) switch (b.provider) {
      case "google":
        g.loginWithGoogleAndCode(b.code);
    }
} ]), angular.module("cvbuilder.controllers").controller("registerController", [ "$rootScope", "$routeParams", "$scope", "$location", "cache", "messageService", "authService", function(a, b, c, d, e, f, g) {
    c.register = function(a) {
        g.register(a);
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
} ]), angular.module("cvbuilder.directives").directive("user", [ "$location", "authService", "userService", function(a, b, c) {
    return {
        restrict: "AE",
        scope: {
            ngModel: "="
        },
        controller: [ "$scope", function(d) {
            d.user = c.user().details, d.logout = function() {
                b.logout(), d.user = {}, a.path("/");
            };
        } ],
        replace: !0,
        templateUrl: "/public/views/protected/partials/user.html",
        link: function() {}
    };
} ]), angular.module("cvbuilder.services", []), angular.module("cvbuilder.services").service("authService", [ "$rootScope", "$http", "$location", "$q", "$cookieStore", "base64", "messageService", "userService", function(a, b, c, d, e, f, g, h) {
    var i = function() {
        e.remove("user-session"), b.defaults.headers.common.Authorization = "", h.clear();
    }, j = function(a) {
        var d = {
            headers: {
                Authorization: "Basic " + f.encode(a.username + ":" + a.password),
                Accept: "application/json;odata=verbose"
            }
        };
        return b.post("/api/authenticate", null, d).then(function(a) {
            var d = h.user();
            d.token = a.data.access_token, d.token_expiry = a.data.expires_in, d.is_authenticated = null !== d.token, 
            b.defaults.headers.common.Authorization = "Session " + d.token, h.getUserDetails().then(function() {
                var a = h.user();
                e.put("user-session", a), c.path("/dashboard");
            });
        }, function() {
            //error
            g.addAlert("Could not login", !1);
        });
    };
    return a.$on("logout", function() {
        i();
    }), {
        logout: function() {
            b.post("/api/logout"), i();
        },
        login: function(a) {
            return j(a);
        },
        loginWithGoogleAndCode: function(a) {
            b.get("/api/oauth/google?code=" + a).then(function(a) {
                console.log(a);
            }, function() {});
        },
        loginWithGoogle: function() {
            //$http.get('/api/login/google', {headers:{"Access-Control-Allow-Origin":"*"}}).then(function(result) {
            //    console.log(result);
            //}, function(error) {
            //    console.log("err: ");
            //    console.log(error);
            //});
            window.location = "/api/login/google";
        },
        register: function(a) {
            var c = f.encode(a.username + ":" + a.password), d = {
                headers: {
                    Authorization: null,
                    Accept: "application/json;odata=verbose"
                }
            };
            return b.put("/api/register", {
                cred: c
            }, d).then(function() {
                return j(a);
            }, function(a) {
                g.addAlert(a.data.message, !1);
            });
        },
        storeToCookie: function() {
            var a = h.user();
            e.put("user-session", a);
        },
        restoreFromCookie: function() {
            var a = h.user();
            if (a.is_authenticated) return !0;
            var c = d.defer(), f = e.get("user-session");
            return f && (h.setUser(f), b.defaults.headers.common.Authorization = "Session " + f.token), 
            c && c.resolve(), c.promise;
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
} ]), angular.module("cvbuilder.services").service("userService", [ "$rootScope", "$http", "$location", "$q", "$cookieStore", "base64", "messageService", function(a, b, c, d, e, f, g) {
    var h = function() {
        return {
            create: function() {
                return {
                    is_authenticated: !1,
                    token: "",
                    token_expiry: "",
                    details: {
                        first_name: "",
                        last_name: "",
                        photo: "",
                        username: "",
                        claims: []
                    }
                };
            }
        };
    }, i = h().create(), j = function() {
        return i;
    };
    return {
        isAuthenticated: function() {
            return void 0 !== i && i.is_authenticated;
        },
        user: function() {
            return j();
        },
        setUser: function(a) {
            i = a;
        },
        clear: function() {
            i = h().create();
        },
        update: function(a, c) {
            return b.post("/api/account/update", {
                user: a,
                password: f.encode(void 0 === c ? "" : c)
            }).then(function() {
                g.addMessage("Your details have been successfully updated");
            }, function() {
                g.addAlert("Failed to update your account. Please try again.", !1);
            });
        },
        getUserDetails: function() {
            return b.get("/api/account").then(function(a) {
                i.details = a.data;
            }, function() {
                g.addAlert("Could not get user information", !1);
            });
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
angular.module("cvbuilder", [ "cvbuilder.routes", "cvbuilder.config", "cvbuilder.filters", "cvbuilder.directives", "cvbuilder.interceptors", "cvbuilder.controllers", "cvbuilder.services", "ngRoute", "ngCookies" ]);