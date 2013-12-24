namespace cvbuilder.web

module UserService = 
    let Create first last email password = {FirstName = first; LastName = last; EmailAddress = email; Password = password}

