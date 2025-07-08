

export const FixMySQLRequestFormat = (dataToFix: any) => {
    try {
        const { obj, feature, reqKey } = dataToFix;

        const fields: string[] = [];
        const fieldValues: any[] = [];

        // หาก obj เป็น Array
        if (Array.isArray(obj)) {
            const keys = Object.keys(obj[0]);

            // สร้าง placeholders สำหรับหลายๆ แถว
            const placeholders = obj.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
            const fieldValues = obj.flatMap((theObj: any) => keys.map(key => theObj[key]));

            // สำหรับ insert 
            if (feature === "insert") {
                const queryString = `(${keys.join(', ')}) VALUES ${placeholders}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                const queryString = `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                const queryString = `SET ${keys.map(key => `${key} = ?`).join(', ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                const queryString = `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }
        } else { // หาก obj เป็น Object เดียว
            // แยกกรณีของ `feature`
            Object.entries(obj).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    console.log("* Array Field Value : ", key, value);
                    const placeholders = value.map(() => '?').join(', ');
                    fields.push(`${key} IN (${placeholders})`);
                    fieldValues.push(...value);
                } else {
                    fields.push(feature === "insert" ? key : `${key} = ?`);
                    fieldValues.push(value);
                }
            });

            // สำหรับ insert
            if (feature === "insert") {
                const queryString = `(${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ select
            if (feature === "select") {
                const queryString = `${fields.join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ update
            if (feature === "update") {
                const queryString = `${fields.join(reqKey === 'set' ? ', ' : ' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }

            // สำหรับ delete
            if (feature === "delete") {
                const queryString = `${fields.join(' AND ')}`;
                return { fields: queryString, params: fieldValues };
            }
        }

        // ถ้าไม่ตรงกับ feature ที่กำหนด
        return { fields: '', params: [] };
    } catch (error: any) {
        console.log('FixMySQLRequestFormat (Error):', error);
        throw error;
    }
}