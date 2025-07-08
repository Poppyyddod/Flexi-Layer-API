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

const dbBrand = 'postgresql';
const feature = 'edit';
const tester = describe;

/**
 * @Edit one row in one query
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("should return success message & affectedRow > 0 & status code is 200 or 404", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: new Date().toISOString(),
            },
            where: {
                test_id: 69
            }
        }

        const response: any = await request(server).patch(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${feature} : `, response);
        expect(response.status === 200 || response.status === 404).toBe(true);

        const obj: EditSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.affectedRows > 0
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});


/**
 * @Edit many row in one query
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("should return success message & affectedRow > 0 & status code is 200 or 404", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: new Date().toISOString(),
            },
            where: {
                test_id: [69]
            }
        }

        const response: any = await request(server).patch(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${feature} : `, response);
        expect(response.status === 200 || response.status === 404).toBe(true);

        const obj: EditSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.affectedRows > 0
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});