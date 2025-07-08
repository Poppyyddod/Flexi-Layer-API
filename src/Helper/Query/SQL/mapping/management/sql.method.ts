import { sql } from "@Configs/Database";
import { CheckResponseMySqlData, CheckResponsePosgreSqlData } from "../../checking";




export const dbTypeSqlManagement: any = {
    mysql: async (data: any) => {
        const [response] = await sql.query(data.cmd, data.params);
        // console.log('SQLmanagement (response) : ', response);

        const checkReturnData = await CheckResponseMySqlData(data.cmd, data.params, response, data.isReturn);
        // console.log('checkReturnData (SQLmanagement)(MySQL) : ', checkReturnData);

        return checkReturnData;
    }
};