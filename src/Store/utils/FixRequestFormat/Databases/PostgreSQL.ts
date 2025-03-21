export const FixPostgreSQLRequestFormat = (dataToFix: any) => {
    try {
        const { obj, feature, reqKey } = dataToFix;

        const fields: string[] = [];
        const fieldValues: any[] = [];

        // หาก obj เป็น Array
        if (Array.isArray(obj)) {
            const keys = Object.keys(obj[0]);

            // สร้าง placeholders สำหรับหลายๆ แถว
            const placeholders = obj
                .map(() => `(${keys.map((_, idx) => `$${idx + 1}`).join(', ')})`)
                .join(', ');
            const fieldValues = obj.flatMap((theObj: any) =>
                keys.map((key) => theObj[key])
            );

            // สำหรับ insert
            if (feature === "insert") {
                const queryString = `INSERT INTO table_name (${keys.join(', ')}) VALUES ${placeholders}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                const queryString = `SELECT * FROM table_name WHERE ${keys
                    .map((key, idx) => `${key} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                const queryString = `UPDATE table_name SET ${keys
                    .map((key, idx) => `${key} = $${idx + 1}`)
                    .join(', ')} WHERE some_condition`; // คุณสามารถแทนที่ `some_condition` ด้วยเงื่อนไขที่ต้องการ
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                const queryString = `${keys
                    .map((key, idx) => `${key} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }
        } else { // หาก obj เป็น Object เดียว
            // แยกกรณีของ `feature`
            Object.entries(obj).forEach(([key, value], idx) => {
                if (Array.isArray(value)) {
                    console.log("* Array Field Value : ", key, value);
                    const placeholders = value
                        .map((_, i) => `$${i + 1 + idx}`).join(', ');
                    fields.push(`${key} IN (${placeholders})`);
                    fieldValues.push(...value);
                } else {
                    fields.push(feature === "insert" && key ? key : `${key} = $${idx + 1}`);
                    fieldValues.push(value);
                }
            });

            // สำหรับ insert
            if (feature === "insert") {
                const queryString = `${fields.join(', ')}) VALUES (${fields
                    .map((_, idx) => `$${idx + 1}`).join(', ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                const queryString = `${fields
                    .map((field, idx) => `${field} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                const queryString = `${fields
                    .map((field, idx) => `${field} = $${idx + 1}`)
                    .join(', ')}`; // เช่นกัน, `some_condition` ควรแทนที่ด้วยเงื่อนไขที่คุณต้องการ
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                const queryString = `${fields
                    .map((_, idx) => `${fields[idx]} = $${idx + 1}`)
                    .join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }
        }

        // ถ้าไม่ตรงกับ feature ที่กำหนด
        return { fields: '', params: [] };
    } catch (error: any) {
        console.log('FixPostgreSQLRequestFormat (Error):', error);
        throw error;
    }
};
