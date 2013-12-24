namespace cvbuilder.web

[<AutoOpen>]
module DomainTypes =
    type User = {FirstName: string; LastName: string; EmailAddress: string; Password: string}
