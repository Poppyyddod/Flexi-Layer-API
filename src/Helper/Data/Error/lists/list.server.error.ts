type ServerErrorModel = {
    [key: string]: {
        more: {
            message: string;
            allowed?: any;
            [key: string]: any;
        };

        code: number;
    };
};

/**
 * ລາຍການ Server Error ແລະ ລາຍລະອຽດ
 */

export const serverError: ServerErrorModel = {
    'invalid_supplier_return_data': {
        more: {
            message: 'Invalid Supplier return data !!',
            read_me: 'Please check your supplier return value. Return value must be key object. In the key object must have : `db_type`, `store`, `set`, `where`'
        },

        code: 500
    },

    'mongodb_query_failed': {
        more: {
            message: 'MongoDB query failed!',
            read_me: 'Please check store system on server side.'
        },

        code: 500
    },

    'missing_comment_field': {
        more: {
            message: 'Missing comment field!!',
            read_me: 'Please check table field comment in the database! All comment fields should be specified.'
        },

        code: 500
    },


    'not_found_the_store': {
        more: {
            message: 'Table does not found in the database!',
            read_me: 'Please make sure `store mapping` in the `.env` file on server-side. it is valid as in the database.'
        },

        code: 500
    },

    'the_code_is_not_supported': {
        more: {
            message: 'The code is not supported!',
            read_me: 'Please check server side.'
        },

        code: 500
    }
}