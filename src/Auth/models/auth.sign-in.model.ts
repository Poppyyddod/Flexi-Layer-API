import { IMyRequestData } from "@SRC/Helper/Model/global.model"
import { Request, Response } from "express"

export interface ISignInData {
    user_name?: string
    user_email?: string
    user_password?: string
}

export interface IUserAuthTableField {
    user_id?: number
    user_name?: string
    user_email?: string
    user_password?: string
    auth_status_id: number
    token?: string
}

export interface IServiceFeatureProps {
    httpRequest: Request
    httpResponse: Response
    validRequestData: IMyRequestData
    feature: string
}