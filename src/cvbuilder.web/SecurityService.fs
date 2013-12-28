namespace cvbuilder.web

open System
open System.Web
open System.Net
open System.Net.Http
open System.Web.Http
open System.Web.Security
open System.Security.Claims

type AuthorizationManager() =
    inherit ClaimsAuthorizationManager()

    override this.CheckAccess(context: AuthorizationContext) =
        let resource = Seq.head context.Resource
        let action = Seq.head context.Action
        let claims = context.Principal.Claims
        let isAuthenticated = if context.Principal = null || not context.Principal.Identity.IsAuthenticated then false else true

        let result = context.Principal.HasClaim(action.Value, resource.Value)

        match result with
        | true -> true
        | false -> raise (new HttpResponseException(if isAuthenticated then HttpStatusCode.Forbidden else HttpStatusCode.Unauthorized))

type ClaimsTransformer() =
    inherit ClaimsAuthenticationManager()

    member this.AddClaims(claim: ClaimsIdentity) =
        claim.AddClaim(new Claim("access", "dashboard"))

    member this.AddClaims(principal: ClaimsPrincipal) = 
        this.AddClaims (Seq.head principal.Identities)
        principal

    override this.Authenticate (resource:string, incomingPrincipal: ClaimsPrincipal) =
        if not incomingPrincipal.Identity.IsAuthenticated then
            base.Authenticate(resource, incomingPrincipal)
        else
            this.AddClaims(incomingPrincipal)

