import { CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';
import { format } from 'date-fns';

let originalLog: any;

beforeAll(async () => {
    originalLog = console.log;
    console.log = jest.fn(); // ปิด console.log

    if (server) {
        await server.close();
    } else {
        await server.connect();
    }
});

afterAll(() => {
    console.log = originalLog; // คืนค่าฟังก์ชันเดิม
});

const dbBrand = 'mysql';
const feature = 'create';
const tester = describe;

/**
 * @Create one row in one query test
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return success message & data(array) & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: `Success testing`,
                number_field: 1,
                timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                boolean_field: 1
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



/**
 * @Create many row in one query test
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return success message & data(array) & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: [
                {
                    string_field: `Success testing Many 1`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: 1
                },
                {
                    string_field: `Success testing Many 2`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: 1
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(201);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.data.length >= 1
        ).toBe(true);
    });
});