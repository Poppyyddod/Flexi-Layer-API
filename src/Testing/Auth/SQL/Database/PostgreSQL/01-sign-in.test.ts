import { AuthSignInSuccessResponseHttp, CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { server, request, TestAuthRoute } from '@Testing/tester.config';
import { isString } from '@SRC/Helper/Utils';

beforeAll(async () => {
    if (server) {
        await server.close();
    }
})

const dbBrand = 'postgresql';
const feature = 'sign-in';
const tester = describe;

/**
 * @Create test
 */

// Create for PostgreSQL
tester(`Test ${dbBrand}/Auth/${feature}`, () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "user_auth",
            where: {
                email: "test@gmail.com",
                secretword: "554455"
            }
        }

        const response: any = await request(server)
            .post(TestAuthRoute[feature])
            .send(bodyData);

        // console.log(`# [RESULT] : Auth/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(200);

        const obj: AuthSignInSuccessResponseHttp = await response.body;
        console.log(`# [OBJECT] : Auth/${dbBrand}/${feature} : `, obj);

        const accessToken = obj.data[0].token;

        // expect(obj.message).toBe("Successfully signed in !!");
        expect(obj.data.length === 1 && accessToken !== undefined).toBe(true);
    });
});