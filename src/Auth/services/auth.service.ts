import StoreService from "@Store/services";
import { AuthServiceKey, authServiceMethod } from "./method";
import { CheckTableDataStructure } from "@Store/validation";


const helperFunctions = {
    StoreService,
}


const AuthCenterService = async (httpResponse: any, validRequestData: any, feature: string) => {
    try {
        console.log('> AuthCenterService : ', validRequestData);

        const theFeature = feature as AuthServiceKey;

        // const validDataStructure = await CheckTableDataStructure({ ...validRequestData, feature });
        // console.log('AuthCenterService (validDataStructure) : ', validDataStructure);

        const service = authServiceMethod[theFeature];
        const dataFromTheService = await service(helperFunctions)(httpResponse, validRequestData, feature);
        console.log('AuthCenterService (dataFromTheService) : ', dataFromTheService);

        return dataFromTheService;
    } catch (error) {
        console.log('AuthCenterService (Error):', error);
        throw error;
    }
}

export default AuthCenterService;