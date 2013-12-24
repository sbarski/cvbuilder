namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Web.Http
open System.Net.Http
open System.Configuration

type VersionRendition() =
    [<DefaultValue>] val mutable Message : string

type VersionController() =
    inherit ApiController()

    [<Route("api/version")>]
    member x.Get() =
        x.Request.CreateResponse(HttpStatusCode.OK, VersionRendition(Message = ConfigurationManager.AppSettings.Item("version")))