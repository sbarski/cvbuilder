namespace cvbuilder.web

open System
open System.Web
open System.Linq
open System.Xml
open System.Web.Http
open System.Threading
open System.Security.Claims
open Thinktecture.IdentityModel
open Thinktecture.IdentityModel.Tokens.Http
open Thinktecture.IdentityModel.Authorization.WebApi

type HttpRouteDefaults = { Controller: string; Id : obj}



type Global() = 
    inherit System.Web.HttpApplication()

    member this.RegisterWebApi(config: HttpConfiguration) =
        config.MapHttpAttributeRoutes()
        config.Routes.MapHttpRoute(
            "DefaultApi", 
            "api/{controller}/{id}", 
            { Controller = "Home"; Id = RouteParameter.Optional}) |> ignore

    member this.ConfigureAuthentication (config: HttpConfiguration) =
        let mapping = new AuthenticationOptionMapping()

        let auth = new AuthenticationConfiguration()
        auth.RequireSsl <- false
        auth.EnableSessionToken <- true
        auth.SendWwwAuthenticateResponseHeaders <- true
        auth.ClaimsAuthenticationManager <- new ClaimsTransformer()
        auth.SessionToken.EndpointAddress <- "/api/authenticate"
        auth.AddBasicAuthentication(fun username password -> if username = "admin" && password = "password" then true else false)

        config.MessageHandlers.Add(new AuthenticationHandler(auth)) 

    member this.Application_Start (sender: obj) (e: EventArgs) =
        GlobalConfiguration.Configure(Action<_> this.RegisterWebApi)
        GlobalConfiguration.Configure(Action<_> this.ConfigureAuthentication)
        ()



