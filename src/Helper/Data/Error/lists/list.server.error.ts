import { supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";

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
    },

    'cmd_is_not_match_the_condition': {
        more: {
            message: "Command line is not match the condition!",
            read_me: "Please check your server side coding any `respositories` file in the system."
        },

        code: 500
    },

    'we_disconnect_the_database': {
        more: {
            message: "We disconnect the database!",
            read_me: "Change the database connect state on server side first.",
            support_for: `${Object.entries(supportForDbTypes).map(([key, value]) => {
                if (value.connect_state) {
                    return key;
                } else {
                    return `${key}(disconnected)`;
                }
            })}`
        },

        code: 500
    }
}