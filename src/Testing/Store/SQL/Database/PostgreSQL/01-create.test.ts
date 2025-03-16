import { CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';
import { format } from 'date-fns';

beforeAll(async () => {
    if (server) {
        await server.close();
    } else {
        await server.connect();
    }
});

const dbBrand = 'postgresql';
const feature = 'create';
const tester = describe;

/**
 * @Create test
 */

// Create for PostgreSQL
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("should return success message & data(array) & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: `Success testing`,
                number_field: 1,
                timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                boolean_field: true
            }
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(201);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("New data from the request successfully created!");
        expect(obj.data.length === 1).toBe(true);
    });
});