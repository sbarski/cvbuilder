namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Web.Http
open System.Net.Http

type HomeRendition() =
    [<DefaultValue>] val mutable Message : string
    [<DefaultValue>] val mutable Time : string

type HomeController() =
    inherit ApiController()

    member x.Get() =
        x.Request.CreateResponse(HttpStatusCode.OK, HomeRendition(Message = "Hello from F#", Time = DateTimeOffset.Now.ToString("o")))