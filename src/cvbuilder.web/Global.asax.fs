namespace cvbuilder.web

open System
open System.Web
open System.Linq
open System.Xml
open System.Web.Http
open System.Net
open System.Threading
open System.Security.Claims
open Thinktecture.IdentityModel
open Thinktecture.IdentityModel.Tokens.Http
open Thinktecture.IdentityModel.Authorization.WebApi

type HttpRouteDefaults = { Controller: string; Id : obj}


type Global() = 
    inherit System.Web.HttpApplication()

    member this.RegisterWebApi(config: HttpConfiguration) =
        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()

        config.MapHttpAttributeRoutes()
        config.Routes.MapHttpRoute(
            "DefaultApi", 
            "api/{controller}/{id}", 
            { Controller = "Home"; Id = RouteParameter.Optional}) |> ignore

    member this.ValidateUser(username: string, password: string) =
        if username = "admin" && password = "admin" then
            true
        else
            raise (new AuthenticationException())

    member this.ConfigureAuthentication (config: HttpConfiguration) =
        let sessionTokenConfiguration = new SessionTokenConfiguration()
        sessionTokenConfiguration.EndpointAddress <- "/api/authenticate"

        let auth = new AuthenticationConfiguration()
        auth.RequireSsl <- false
        auth.EnableSessionToken <- true
        auth.SendWwwAuthenticateResponseHeaders <- false
        auth.SessionToken <- sessionTokenConfiguration
        auth.ClaimsAuthenticationManager <- new ClaimsTransformer()
        
        let securityTokenHandler = new Thinktecture.IdentityModel.Tokens.Http.BasicAuthenticationSecurityTokenHandler(fun username password -> this.ValidateUser(username, password))
        securityTokenHandler.RetainPassword <- false

        let authorizationMapping = new AuthenticationOptionMapping()
        authorizationMapping.Options <- AuthenticationOptions.ForAuthorizationHeader("Basic")
        authorizationMapping.TokenHandler <- new System.IdentityModel.Tokens.SecurityTokenHandlerCollection()
        authorizationMapping.TokenHandler.Add(securityTokenHandler)
        authorizationMapping.Scheme <- AuthenticationScheme.SchemeOnly("Basic")
        auth.AddMapping(authorizationMapping)

        let tokenMapping = new AuthenticationOptionMapping()
        tokenMapping.Options <- AuthenticationOptions.ForAuthorizationHeader("Session")
        tokenMapping.TokenHandler <- System.IdentityModel.Tokens.SecurityTokenHandlerCollection.CreateDefaultSecurityTokenHandlerCollection()
        auth.AddMapping(tokenMapping)
        
        config.MessageHandlers.Add(new AuthenticationHandler(auth)) 

    member this.Application_Start (sender: obj) (e: EventArgs) =
        GlobalConfiguration.Configure(Action<_> this.RegisterWebApi)
        GlobalConfiguration.Configure(Action<_> this.ConfigureAuthentication)
        ()



