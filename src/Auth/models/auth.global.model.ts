export interface IReturnToControllerCenter {
    data: any,
    feature: string
}

export interface IReturnToCenterServiceData {
    response: IResponseDataInReturnToCenterService
    status_code: number
}

export interface IResponseDataInReturnToCenterService {
    message: string
    feature: string
    data: any
}