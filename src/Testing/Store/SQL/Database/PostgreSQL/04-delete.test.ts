import { EditSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';

beforeAll(async () => {
    if (server) {
        await server.close();
    }
})

const dbBrand = 'postgresql';
const feature = 'delete';
const tester = describe;

// Create for PostgreSQL
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("should return & affectedRow > 0 & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            where: {
                number_field: 1
            }
        }

        const response: any = await request(server).delete(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${feature} : `, response);
        expect(
            response.status === 200 
            || response.status === 404
        ).toBe(true);

        const obj: EditSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.affectedRows > 0 
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});