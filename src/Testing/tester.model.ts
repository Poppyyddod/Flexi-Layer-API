export interface AuthSignInSuccessResponseHttp {
    message: string,
    system: string,
    feature: string,
    data: Array<any>,
    token: string
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