﻿namespace cvbuilder.web

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

    member x.Post([<FromBody>] username : string, [<FromBody>] password: string) =
        //let authenticationCookie = SecurityService.CreateAuthenticationCookie (Guid.Empty, username, password)
        //let authenticationToken = SecurityService.CreateAuthenticationToken()
        x.Request.CreateResponse(HttpStatusCode.OK, "")