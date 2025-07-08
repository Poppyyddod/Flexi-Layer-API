## We have these feature for the feature :

* Already feature:
- Sign-In (SQL)
    Argon2
    StoreService
    JsonWebToken

- Sign-Up (SQL)
    Argon2
    XSS
    Auth Data Validation
    StoreService

- Sign-Out (SQL)
    StoreService
    JsonWebToken

- Refresh-Token (SQL)
    StoreService
    JsonWebToken

* Request Format:
- Sign-up
{
    db_type: "mysql",
    store_code: "user_auth",
    set: {
        user_email: "example@gmail.com",
        user_name: "example name",
        user_password: "Example1!@"
    }
}

- Sign-in
{
    db_type: "mysql",
    store_code: "user_auth",
    where: {
        user_email: "example@gmail.com",
        user_password: "Example1!@"
    }
}

- Sign-out
{
    db_type: "mysql",
    store_code: "user_auth",
    where: {
        user_id: #number
    }
}

- Refresh Token
{
    db_type: "mysql",
    store_code: "user_auth",
    where: {
        refresh_token: "#jwt_token"
    }
}