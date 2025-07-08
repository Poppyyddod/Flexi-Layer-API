import { isObject } from "@SRC/Helper/Utils";

export const FixPostgreSQLRequestFormat = (dataToFix: any) => {
    try {
        console.log("FixPostgreSQLRequestFormat (dataToFix) : ", dataToFix);
        const { obj, feature, beforeObjLength, reqKey } = dataToFix;

        const fields: string[] = [];
        const fieldValues: any[] = [];
        let placeholderIndex = beforeObjLength !== 0 && reqKey === "where" ? beforeObjLength + 1 : 1;
        console.log("FixPostgreSQLRequestFormat (start from)(placeholderIndex) : ", placeholderIndex);

        // หาก obj เป็น Array
        if (Array.isArray(obj)) {
            const keys = Object.keys(obj[0]);

            // สร้าง placeholders สำหรับหลายๆ แถว
            const placeholders = obj
                .map(() => `(${keys.map((_, idx) => `$${placeholderIndex++}`).join(', ')})`)
                .join(', ');
            const fieldValues = obj.flatMap((theObj: any) =>
                keys.map((key) => theObj[key])
            );

            // สำหรับ insert
            if (feature === "insert") {
                const queryString = `(${keys.join(', ')}) VALUES ${placeholders}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                const queryString = `${keys
                    .map((key, idx) => `${key} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                const queryString = `${keys
                    .map((key, idx) => `${key} = $${placeholderIndex++}`)
                    .join(', ')}`; // คุณสามารถแทนที่ `some_condition` ด้วยเงื่อนไขที่ต้องการ
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                const queryString = `${keys
                    .map((key, idx) => `${key} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }
        } else if (isObject(obj)) { // หาก obj เป็น Object เดียว
            console.log("FixPostgreSQLRequestFormat (Object)(obj) : ", obj);

            Object.entries(obj).forEach(([key, value]) => {
                if (value === null) {
                    fields.push(`${key} IS NULL`);
                } else if (Array.isArray(value)) {
                    if (value.includes(null)) {
                        fields.push(`${key} IS NULL`);
                    } else {
                        const placeholders = value.map((item) => {
                            // if (isObject(item)) {
                            //     throw { kind: 'invalid_data_type' };
                            // }

                            return `$${placeholderIndex++}`;
                        }).join(', ');
                        fields.push(`${key} IN (${placeholders})`);
                        fieldValues.push(...value);
                    }
                } else {
                    fields.push(feature === "insert" ? key : `${key} = $${placeholderIndex++}`);
                    fieldValues.push(value);
                }
            });

            // สำหรับ insert
            if (feature === "insert") {
                console.log("* fields (Object)(insert): ", fields);
                const queryString = `(${fields.join(', ')}) VALUES (${fields
                    .map((_, idx) => `$${idx + 1}`).join(', ')})`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                console.log("* fields (select): ", fields);

                const queryString = `${fields
                    .map((field, idx) => field)
                    .join(' AND ')}`;

                console.log("* queryString (select): ", queryString);
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                console.log("* fields (update): ", fields);

                const queryString = `${fields
                    .map((field, idx) => field)
                    .join(', ')}`;

                console.log("* queryString (update): ", queryString);
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                console.log("* fields (delete): ", fields);

                const queryString = `${fields
                    .map((field, idx) => field)
                    .join(' AND ')}`;

                console.log("* queryString (delete): ", queryString);
                return { fields: queryString, params: fieldValues };
            }
        } else {
            console.log("FixPostgreSQLRequestFormat (else)(obj) : ", obj);
            if (obj.includes(":LAST")) {
                const splitedObj = obj.split(":");

                if (splitedObj.length != 2) throw { kind: "incomplete_request" };

                // const queryString = `${splitedObj[0]} ORDER BY ${splitedObj[0]} DESC`;
                const queryString = `${splitedObj[0]} ORDER BY ${splitedObj[0]} DESC`;
                // const params = []
                return {
                    fields: queryString,
                    params: []
                }
            }
        }

        // ถ้าไม่ตรงกับ feature ที่กำหนด
        return { fields: '', params: [] };
    } catch (error: any) {
        console.log('FixPostgreSQLRequestFormat (Error):', error);
        throw error;
    }
};
