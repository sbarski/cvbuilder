namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Web.Http
open System.Net.Http
open System.Configuration
open System.Threading
open HttpClient
open Newtonsoft.Json
open System.Security.Claims
open System.IdentityModel.Services
open System.IdentityModel.Tokens
open Thinktecture.IdentityModel.Authorization.WebApi
open cvbuilder.core.db
open cvbuilder.auth

[<RoutePrefix("api/oauth")>]
type OAuthController() =
    inherit ApiController()

    [<Route("google")>]
    member x.Get() =
        let oauth = OAuthCallback()
        let context = HttpContext.Current
        let result = oauth.ProcessRequest(context)

        x.Request.CreateResponse(HttpStatusCode.OK, result)

