type AuthSignInData = {
    user_id: number
    user_name: string
    user_email: string
    user_status_id: number
    user_role_id: number
    auth_status_id: number
    created_at: string
    updated_at: string
    token: string
}

export interface AuthSignInSuccessResponseHttp {
    message: string
    feature: string
    data: AuthSignInData
}


type AuthSignUpData = {
    user_id: number
    user_name: string
    user_email: string
    user_status_id: number
    user_role_id: number
    auth_status_id: number
    created_at: string
    updated_at: string
}

export interface AuthSignUpSuccessResponseHttp {
    message: string
    feature: string
    data: AuthSignUpData[]
}

type AuthSignOutData = {
    query: object
    affectedRows: number
}

export interface AuthSignOutSuccessResponseHttp {
    message: string
    feature: string
    data: AuthSignOutData
}




/**
 * For success fetching
 */
export interface FetchSuccessDataResponseHttp {
    message: string,
    system: string,
    feature: string,
    data: Array<any>
}


/**
 * For success creating
 */
export interface CreateSuccessDataResponseHttp {
    message: string,
    system: string,
    feature: string,
    data: Array<any>
}


/**
 * For success editing
 */
export interface EditSuccessDataResponseHttp {
    message: string,
    system: string,
    feature: string,
    store_code: string,
    query: {
        db_type: string,
        store_code: string,
        where: any,
        set: any
    },
    affectedRows: number
}


/**
 * For success deleting
 */
export interface DeleteSuccessDataResponseHttp {
    message: string,
    system: string,
    feature: string,
    store_code: string,
    query: {
        db_type: string,
        store_code: string,
        where: any,
        set: any
    },
    affectedRows: number
}