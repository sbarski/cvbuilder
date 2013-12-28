namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Web.Http
open System.Net.Http
open System.Configuration
open HttpClient

[<RoutePrefix("api/login")>]
type LoginController() =
    inherit ApiController()

    [<Authorize>]
    member x.Post() =
        let m = "hello"
        
        x.Request.CreateResponse(HttpStatusCode.Accepted, "")