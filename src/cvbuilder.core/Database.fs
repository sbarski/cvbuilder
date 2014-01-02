namespace cvbuilder.core

[<AutoOpen>]
module db =

    open System
    open Neo4jClient
    open System.Linq
    open System.Configuration

    [<CLIMutable>]
    type UserDetails = { first_name: string; last_name: string; }
    
    [<CLIMutable>]
    type User = { auth_token: string; username: string; password: string; id: System.Guid; created_on: System.DateTimeOffset; updated_on: System.DateTimeOffset}

    let client = new GraphClient(new Uri("http://localhost:7474/db/data"))

    let CreateUser user = 
        try
            client.Cypher
                .Create("(x: User {param})")
                .WithParam("param", user)
                .Return<User>("x")
                .Results
                .Single()
        with
        | :? Neo4jClient.NeoException as ex -> raise (new System.ArgumentException("User already exists", ex))
        | _ -> raise (new System.Exception("Could not create a new user"))

    let UserExists username = 
        client.Cypher
            .Match("(x:User {username:{username}})")
            .WithParam("username", username)
            .Return<User>("x")
            .Results
            .Any()

    let GetUser username password = 
        client.Cypher
            .Match("(x:User {username:{username}, password:{password}})")
            .WithParam("username", username)
            .WithParam("password", password)
            .Return<User>("x")
            .Results
            .SingleOrDefault()

    let SetUserToken username token =
        client.Cypher
            .Match("(x:User)")
            .Where(fun (x:User) -> x.username = username)
            .Set("x.auth_token = {token}")
            .WithParam("token", token)
            .ExecuteWithoutResults()

    type instance() =
        member this.run() =
            client.Connect() 

            //client.Cypher.CreateConstraint("user:User", "user.username").ExecuteWithoutResults() |> ignore;
            //client.Cypher.CreateConstraint("user:User", "user.id").ExecuteWithoutResults() |> ignore;

            
