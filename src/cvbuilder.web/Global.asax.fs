namespace cvbuilder.web

open System
open System.Web.Http

type HttpRouteDefaults = { Controller: string; Id : obj}

type Global() = 
    inherit System.Web.HttpApplication()

    member this.RegisterWebApi(config: HttpConfiguration) =
        config.MapHttpAttributeRoutes()
        config.Routes.MapHttpRoute(
            "DefaultApi", 
            "api/{controller}/{id}", 
            { Controller = "Home"; Id = RouteParameter.Optional}) |> ignore

    member this.Application_Start (sender: obj) (e: EventArgs) =
        GlobalConfiguration.Configure(Action<_> this.RegisterWebApi)
        ()



