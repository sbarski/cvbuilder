namespace cvbuilder.web

open System
open System.Web
open System.Linq
open System.Xml
open System.Web.Http
open System.Net
open System.Net.Http
open System.Threading
open System.Security.Claims
open Thinktecture.IdentityModel
open Thinktecture.IdentityModel.Tokens.Http
open System.IdentityModel.Tokens
open System.IdentityModel.Protocols.WSTrust
open Thinktecture.IdentityModel.Authorization.WebApi

type HttpRouteDefaults = { Controller: string; Id : obj}

   
type MyAuthenticationConfiguration(configuration: AuthenticationConfiguration) =
    inherit Thinktecture.IdentityModel.Tokens.Http.HttpAuthentication(configuration: AuthenticationConfiguration)

    override x.Authenticate(request: System.Net.Http.HttpRequestMessage) =
        base.Authenticate(request)

    override x.AuthenticateSessionToken(request: System.Net.Http.HttpRequestMessage) =
        try
            base.AuthenticateSessionToken(request)
        with
        | _ -> 
            let exc = AuthenticationException("Security Token Validation Failure - Probably Expired")
            exc.StatusCode <- HttpStatusCode.NotAcceptable
            exc.ReasonPhrase <- "Security Token Validation Failure"
            raise exc

type MyAuthenticationHandler(configuration: Thinktecture.IdentityModel.Tokens.Http.HttpAuthentication, ?httpConfiguration: System.Web.Http.HttpConfiguration) = 
    inherit Thinktecture.IdentityModel.Tokens.Http.AuthenticationHandler(configuration, httpConfiguration = null)

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
        auth.SessionToken.DefaultTokenLifetime <- TimeSpan.FromSeconds(1.0)
        auth.InheritHostClientIdentity <- false
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
        auth.AddMapping(tokenMapping)
        
        let myHttpAuthentication = new MyAuthenticationConfiguration(auth);

        config.MessageHandlers.Add(new MyAuthenticationHandler(myHttpAuthentication)) 

    member this.Application_Start (sender: obj) (e: EventArgs) =
        GlobalConfiguration.Configure(Action<_> this.RegisterWebApi)
        GlobalConfiguration.Configure(Action<_> this.ConfigureAuthentication)
        ()



