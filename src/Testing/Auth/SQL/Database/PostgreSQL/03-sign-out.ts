import { FetchSuccessDataResponseHttp } from '@Testing/tester.model';
import { server, request, TestAuthRoute } from '@Testing/tester.config';

beforeAll(async () => {
    if (server) {
        await server.close();
    }
})

const dbBrand = 'postgresql';
const feature = 'sign-out';
const tester = describe;

/**
 * @Create test
 */

// Create for PostgreSQL
tester(`Test ${dbBrand}/Auth/${feature}`, () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "user_privacy",
            set: {
                email: "example@gmail.com"
            }
        }

        const response: any = await request(server)
            .post(TestAuthRoute[feature])
            .send(bodyData);

        // console.log(`# [RESULT] : Auth/${dbBrand}/${${feature} : `, response);
        expect(
            response.status === 200
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Auth/${dbBrand}/${feature} : `, obj);

        expect(
            obj.data?.length === 1 
        ).toBe(true);
    });
});