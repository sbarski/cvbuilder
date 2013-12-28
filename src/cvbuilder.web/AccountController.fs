namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Web.Http
open System.Net.Http
open System.Configuration
open HttpClient
open Newtonsoft.Json

type User = {
    name: string;
    photo: string;
}

[<RoutePrefix("api/account")>]
type AccountController() =
    inherit ApiController()

    [<Authorize>]
    member x.Get() =
        let user = {name = "Peter Sbarski"; photo = "Photo"}
        x.Request.CreateResponse(HttpStatusCode.Accepted, user)
