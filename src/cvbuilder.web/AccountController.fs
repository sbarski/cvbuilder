﻿namespace cvbuilder.web

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

type Claim = {
    action: string;
    resource: string;
}

type User = {
    first_name: string;
    last_name: string;
    photo: string;
    claims: list<Claim>;
    username: string;
}

[<RoutePrefix("api/account")>]
type AccountController() =
    inherit ApiController()

    [<Authorize>]
    member x.Get() =
        let claims = List.map (fun (claim:System.Security.Claims.Claim) -> {action = claim.Type; resource = claim.Value}) (List.ofSeq ClaimsPrincipal.Current.Claims)
        let user = {first_name = "Peter"; last_name="Sbarski"; photo = "Photo"; claims = claims; username="peter.sbarski@gmail.com"}
        x.Request.CreateResponse(HttpStatusCode.Accepted, user)

    [<Authorize>]
    [<Route("update")>]
    member x.Post([<FromBody>] user: Newtonsoft.Json.Linq.JObject) =
        x.Request.CreateResponse(HttpStatusCode.OK);


