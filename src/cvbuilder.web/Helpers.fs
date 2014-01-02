namespace cvbuilder.web

[<AutoOpen>]
module Helpers =

    //This is used to test whether a type is null without using the AllowNullLiteral attribute
    let inline isNull< ^a when ^a : not struct> (x:^a) = 
        obj.ReferenceEquals (x, Unchecked.defaultof<_>)
