namespace cvbuilder.web

open System
open System.Web
open System.Web.Security

module SecurityService =
    type CreateAuthenticationCookie(userId:Guid, username:string, password:string) =
        let ticket = new FormsAuthenticationTicket(1, username, DateTime.Now.ToLocalTime(), DateTime.Now.ToLocalTime().AddYears(1), false, String.Empty)
        let cookieBody = FormsAuthentication.Encrypt(ticket)
        let cookie = new HttpCookie(FormsAuthentication.FormsCookieName, cookieBody)

    type CreateAuthenticationToken() =
        let token = "sdfsdfsdf"