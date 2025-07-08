//#region Testing header
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

const dbBrand = 'postgresql';
const feature = 'create';
const tester = describe;
//#endregion

//#region Incomplete request error message (Testing)
/**
 * @Create error #Incomplete request
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(ALL) should return error message 'Incomplete request!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            // set: {
            //     string_field: 1,
            //     number_field: "1",
            //     timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            //     boolean_field: true
            // }
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Incomplete request!");
    });
});
//#endregion

//#region Missing required field error message (Testing)
/**
 * @Create error #Missing required field (For create a row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return error message 'Missing any required field!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: `Success testing`,
                number_field: 1
            }
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Missing any required field!");
    });
});



/**
 * @Create error #Missing required field (For create many row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return error message 'Missing any required field!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: [
                {
                    string_field: `Success testing`,
                    number_field: 1
                },
                {
                    string_field: `Success testing`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Missing any required field!");
    });
});
//#endregion

//#region Any field name is invalid error message (Testing)
/**
 * @Create error #Any field name is invalid (For create one row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return error message 'Any field name is invalid!' & status code is '404'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: `Success testing`,
                number_fake_field: 1,
                timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                boolean_field: true
            }
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(404);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Any field name is invalid!");
    });
});



/**
 * @Create error #Any field name is invalid (For create many row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return error message 'Any field name is invalid!' & status code is '404'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: [
                {
                    string_field: `Success testing`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                },
                {
                    string_field: `Success testing`,
                    number_fake_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(404);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Any field name is invalid!");
    });
});
//#endregion

//#region Invalid request data type error message(Testing)

/**
 * @Create error #Invalid request data type (For create one row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return error message 'Invalid request data type!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: {
                string_field: 1,
                number_field: "1",
                timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                boolean_field: true
            }
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Invalid request data type!");
    });
});

/**
 * @Create error #Invalid request data type (For create many row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return error message 'Invalid request data type!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: [
                {
                    string_field: 1,
                    number_field: "1",
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                },
                {
                    string_field: `Success testing`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Invalid request data type!");
    });
});

/**
 * @Create error #Invalid request data type (For create one row)
 */

tester(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return error message 'Invalid request data type!' & status code is '400'", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            set: [
                {
                    string_field: [{ id: 1 }],
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                },
                {
                    string_field: `Success testing`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: true
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(400);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(obj.message).toBe("Invalid request data type!");
    });
});
//#endregion

