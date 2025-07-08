import { SQLmanagement } from "@Helper/Query/SQL";




export const CreateAuthRespo = async (request: any) => {
    try {
        console.log('CreateAuthRespo : ', request);

        const cmd = "INSERT INTO auths SET ?";
        const newAuth = await SQLmanagement(request.db_type, {
            cmd,
            params: [request],
            isReturn: true
        });

        console.log('CreateAuthRespo (reponse) : ', newAuth);

        const cmdToGetAuth = "SELECT * FROM auths WHERE id = ?";
        const [newAuthData] = await SQLmanagement(request.db_type, {
            cmd: cmdToGetAuth,
            params: [newAuth.insertId],
            isReturn: true
        });

        console.log('CreateAuthRespo (newAuthData) : ', newAuthData);

        return newAuthData || [];
    } catch (error) {
        console.log('CreateAuthRespo (error) : ', error);
        throw error;
    }
}



export const CheckAuthRespo = async (request: any) => {
    try {
        console.log('CheckAuthService (Request) : ', request);

        const cmd = 'SELECT * FROM auths WHERE name = ?';
        const response = await SQLmanagement(request.db_type, { cmd, params: [request.name], isReturn: true });
        console.log('CheckAuthRespo SQLmanagement (response) : ', response);

        return response || [];
    } catch (error) {
        console.log('CheckAuthRespo (error) : ', error);
        throw error;
    }
}

