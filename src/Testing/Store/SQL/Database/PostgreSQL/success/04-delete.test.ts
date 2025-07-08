import { EditSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';

// ปิด console.log ก่อนเริ่มการทดสอบทั้งหมด
let originalLog: any;
beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn(); // ปิด console.log

    if (server) {
        server.close();
    } else {
        server.connect();
    }
});

// คืนค่าฟังก์ชันเดิมหลังจากการทดสอบเสร็จสิ้น
afterAll(() => {
    console.log = originalLog; // คืนค่าฟังก์ชันเดิม
});

const dbBrand = 'postgresql';
const feature = 'delete';
const tester = describe;

/**
 * @Delete one row in one query
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return & affectedRow > 0 & status code is 200", async () => {
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
 * @Delete many row in one query
 */
tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return & affectedRow > 0 & status code is 200 or 404", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            where: {
                number_field: [1]
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
