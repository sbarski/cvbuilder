namespace cvbuilder.auth

open System
open System.Net.Http
open DotNetOpenAuth
open DotNetOpenAuth.OAuth2
open DotNetOpenAuth.Messaging
open DotNetOpenAuth.OAuth2.Messages
open Newtonsoft.Json.Linq
open Newtonsoft

type GoogleProxy() =
    member private x.ValidateToken(tokenInfo:JObject, expectedAudience:string) = 
        let audience = tokenInfo.SelectToken("audience").ToObject()
        if String.IsNullOrEmpty(audience) || String.Equals(audience, expectedAudience) = false then
            raise (new System.ArgumentException("Token with an expected audience"))

        let expires = tokenInfo.SelectToken("expires_in").ToObject()

        if expires = null then
            false
        else
            true

    member private x.GetUserInfo(authToken:string) =
        let userInfoUri = String.Format("https://www.googleapis.com/oauth2/v1/userinfo")
        let hc = new HttpClient()
        hc.DefaultRequestHeaders.Authorization <- new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken)
        let response = hc.GetAsync(userInfoUri).Result
        let userInfo = response.Content.ReadAsStringAsync().Result
        JObject.Parse(userInfo)

    member private x.GetTokenInfo(authToken:string) = 
        let verificationUri = String.Format("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={0}", authToken)
        let hc = new HttpClient()
        let response = hc.GetAsync(verificationUri).Result;
        let tokenInfo = response.Content.ReadAsStringAsync().Result
        JObject.Parse(tokenInfo)

    member x.UserInfo(auth: IAuthorizationState) =
        let tokenInfo = x.GetTokenInfo(auth.AccessToken)
        let validate = x.ValidateToken(tokenInfo, "296155646128.apps.googleusercontent.com")
        let userInfo = x.GetUserInfo(auth.AccessToken)
        Console.WriteLine(userInfo.SelectToken("name").ToObject().ToString())
        Console.WriteLine(userInfo.SelectToken("email").ToObject().ToString())
        userInfo

type AuthTracker() =
    interface DotNetOpenAuth.OAuth2.IClientAuthorizationTracker with

        member x.GetAuthorizationState(callbackUrl: Uri, clientState: string) =
            let auth = new AuthorizationState()
            auth.Callback <- callbackUrl
            (auth :> DotNetOpenAuth.OAuth2.IAuthorizationState)

type AuthHelper() =
    static member GetAuthServerDescription() =
        let auth = new AuthorizationServerDescription()
        auth.AuthorizationEndpoint <- new Uri(@"https://accounts.google.com/o/oauth2/auth")
        auth.TokenEndpoint <- new Uri(@"https://accounts.google.com/o/oauth2/token")
        auth.ProtocolVersion <- ProtocolVersion.V20
        auth

    static member CreateClient() =
        let desc = AuthHelper.GetAuthServerDescription()
        let client = new WebServerClient(desc, "296155646128.apps.googleusercontent.com")
        client.ClientCredentialApplicator <- ClientCredentialApplicator.PostParameter("e1Nwl9I12nJDvy7rbA-W1mbB")
        client.AuthorizationTracker <- new AuthTracker()
        client

    static member Client = AuthHelper.CreateClient()

type OAuthCallback() =
    member x.ProcessRequest(request: System.Web.HttpContext) =
        let client = AuthHelper.Client
        let s = new AuthorizationState()
        let context = new System.Web.HttpContextWrapper(request)
        client.ClientCredentialApplicator <- ClientCredentialApplicator.PostParameter("e1Nwl9I12nJDvy7rbA-W1mbB")
        let auth = client.ProcessUserAuthorization(context.Request)
        let googleAuth = new GoogleProxy()
        let user = googleAuth.UserInfo(auth)
        user

    member x.InitAuth() =
        let state = new AuthorizationState()
        state.Callback <- new Uri("http://localhost/oauth/google")
        state.Scope.Add("https://www.googleapis.com/auth/userinfo.profile") |> ignore
        state.Scope.Add("https://www.googleapis.com/auth/userinfo.email") |> ignore
        let request = AuthHelper.Client.PrepareRequestUserAuthorization(state)
        request.Headers.Add("Access-Control-Allow-Origin", "*")
        request.AsHttpResponseMessage()

