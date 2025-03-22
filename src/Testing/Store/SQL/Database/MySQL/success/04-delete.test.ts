import { EditSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';

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
const feature = 'delete';
const tester = describe;

/**
 * @Delete same as column data in one request
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Same) should return & affectedRow > 0 & status code is 200", async () => {
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


/**
 * @Delete not same column data in one request
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Not Same) should return & affectedRow > 0 & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            where: {
                string_field: ["Success testing", "Success testing Many 1", "Success testing Many 2"]
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