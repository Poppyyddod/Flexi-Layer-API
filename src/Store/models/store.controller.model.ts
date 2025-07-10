export interface IStoreReturnToServiceCenter {
    db_type: string,
    store_code: any,
    fixedFormat: IFixedToQueryFormat
    kind?: string | undefined
}

export interface IFixedToQueryFormat {
    where?: string
    set?: string
    field_list?: string
    params: any[]
}

export interface IStoreReturnToControllerCenter {
    response: IStoreResponseInReturnToControllerCenter
    status_code: number
}

export interface IStoreResponseInReturnToControllerCenter {
    message?: string
    feature?: string
    data?: any
}
