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
        let user = GetCurrentUser x.User.Identity.Name
                   |> fun x -> {first_name = x.first_name; last_name = x.last_name; photo = "Photo"; claims = claims; username = x.username}

        x.Request.CreateResponse(HttpStatusCode.Accepted, user)

    [<Authorize>]
    [<Route("update")>]
    member x.Post([<FromBody>] data: Newtonsoft.Json.Linq.JObject) =
        let user = GetCurrentUser x.User.Identity.Name
        let currentPassword = user.password
        let password = data.SelectToken("password").ToObject()
                                |> fun result -> System.Text.Encoding.Default.GetString (System.Convert.FromBase64String result) 
                                |> fun sanitize -> if String.Equals(sanitize, "\0") then String.Empty else sanitize
                                |> fun pass -> if String.IsNullOrWhiteSpace(pass) then currentPassword else pass

        let information = data.SelectToken("user")
        let first_name = information.SelectToken("first_name").ToObject()
        let last_name = information.SelectToken("last_name").ToObject()
        let username = information.SelectToken("username").ToObject()

        let updated = {user with first_name = first_name; last_name = last_name; username = username; password = password; updated_on = DateTimeOffset.UtcNow}

        SaveCurrentUser updated
                
        x.Request.CreateResponse(HttpStatusCode.OK);


