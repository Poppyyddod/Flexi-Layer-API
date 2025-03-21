import { pgsql, sql } from "@Configs/Database";
import { CheckResponseMySqlData, CheckResponsePosgreSqlData } from "../../checking";




export const dbTypeSqlManagement: any = {
    postgresql: async (data: any) => {
        const response = await pgsql.query(data.cmd, data.params);
        // console.log('SQLmanagement (response) : ', response);

        const checkReturnData = await CheckResponsePosgreSqlData(data.cmd, data.params, response, data.isReturn);
        // console.log('checkReturnData (SQLmanagement)(PostgreSQL) : ', checkReturnData);

        return checkReturnData;
    },


    mysql: async (data: any) => {
        const [response] = await sql.query(data.cmd, data.params);
        // console.log('SQLmanagement (response) : ', response);

        const checkReturnData = await CheckResponseMySqlData(data.cmd, data.params, response, data.isReturn);
        // console.log('checkReturnData (SQLmanagement)(MySQL) : ', checkReturnData);

        return checkReturnData;
    }
};