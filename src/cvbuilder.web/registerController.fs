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
open Microsoft.FSharp.Core
open Newtonsoft.Json.Linq
open cvbuilder.core.db

[<RoutePrefix("api/register")>]
type RegisterController() =
    inherit ApiController()

    member x.Put([<FromBody>] data: Newtonsoft.Json.Linq.JObject) =
        if data = null then
            x.Request.CreateErrorResponse(HttpStatusCode.PreconditionFailed, "The authorization header was not included")
        else
            let user = data.GetValue("cred").ToString()
                       |> fun result -> System.Text.Encoding.Default.GetString (System.Convert.FromBase64String result)       
                       |> fun line -> line.Split([|':'|]) 
                       |> fun data -> {defaultUser with username = data.[0]; password = data.[1]; id = Guid.NewGuid(); created_on = DateTimeOffset.UtcNow; updated_on = DateTimeOffset.UtcNow }

            if UserExists user.username then
                x.Request.CreateErrorResponse(HttpStatusCode.PreconditionFailed, "User with the given username/email already exists.")
            else
                try
                    let createdUser = CreateUser user //create user
                    x.Request.CreateResponse(HttpStatusCode.OK); //the user can request the token now
                with
                | ex -> x.Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "We couldn't create a new user. Please try again.")


