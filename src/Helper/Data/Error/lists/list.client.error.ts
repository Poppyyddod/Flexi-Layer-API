import { supportForDbTypes } from "../../Center/list/list.db-type.support";
import { noSqlSupporterList } from "../../Center/list/list.nosql-supporter";
import { storeFields } from "./list.sql.error";


type Features = 'fetch' | 'create' | 'edit' | 'remove';
type StoreFieldNames = keyof typeof storeFields;

// type ErrorSystem = {
//     error: any,
//     systemName: StoreFieldNames;
//     feature: Features;
// };

type ClientErrorModel = {
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
 * ລາຍການ Client Error ແລະ ລາຍລະອຽດ
 */

export const clientError: ClientErrorModel = {
    'object_id_must_be_array': {
        more: {
            message: 'In the request `where` `_id` must be array!',
            read_me: 'Please check the `_id` field in the request. `_id` must be array.'
        },

        code: 400
    },

    'cannot_mix_where_data_with_nosql': {
        more: {
            message: 'Cannot mix object id with other data in `where`',
            read_me: 'Please check the `where` data in the request. If the request has `_id`. it must has just `_id` or without `_id` #For NoSQL'
        },

        code: 400
    },

    'null_data': {
        more: {
            message: 'No row in the store!',
            read_me: 'There are not any row in the store.'
        },

        code: 200
    },

    'not_found_data': {
        more: {
            message: "Data's not found!",
            read_me: "Please check your `where` data in the request! The requested data may not be available in the store."
        },

        code: 404,
    },

    'email_already_exist': {
        more: {
            message: "Email is exist!",
            read_me: "Please input your new email. Because it already exist!"
        },

        code: 409
    },

    'incorrect_password': {
        more: {
            message: "Secretword is incorrect!",
            read_me: "Please check `email` and `secretword` in the request. Because it is incorrect."
        },

        code: 401
    },

    'invalid_nosql_supporter_feature': {
        more: {
            message: 'Invalid `nosql_supporter` feature name!',
            read_me: 'Please check the request key `nosql_supporter`. Provide the valid feature name for `nosql_supporter` the feature.',
            allowed: (error: any, systemName: string, feature: string) => {
                return {
                    list_nosql_supporter: {
                        [`${feature}_feature`]: { ...noSqlSupporterList[feature], ...noSqlSupporterList['global'] }
                    }
                };
            },
        },

        code: 400
    },

    'limit_must_be_number': {
        more: {
            message: "`limit` feature key error!",
            read_me: {
                rule_1: "Please check `limit` key in the request. `limit` must be number type.",
                rule_2: "It must be greater than 0."
            },
        },

        code: 400
    },

    'invalid_nosql_supporter_data_type': {
        more: {
            message: 'Invalid `nosql_supporter` key data type!',
            read_me: 'Please check the request key `nosql_supporter`. Provide the valid data type for `nosql_supporter` the feature.',
            allowed: (error: any, systemName: string, feature: string) => {
                return {
                    list_nosql_supporter: {
                        [`${feature}_feature`]: { ...noSqlSupporterList[feature], ...noSqlSupporterList['global'] }
                    }
                };
            },
        },

        code: 400
    },

    'missing_required_field': {
        more: {
            message: 'Missing any required field!',
            feature: 'create',
            read_me: 'Please check your request fields. Maybe its missing required fields or invalid field name.',
        },

        code: 400
    },

    'cannot_support_the_database_type': {
        more: {
            message: 'Cannot support the database type!',
            read_me: 'Please check `db_type` in the request.',
            support_for: `${Object.keys(supportForDbTypes)?.join(", ")}`
        },

        code: 400
    },

    'unique_row_data': {
        more: {
            message: 'Duplicate key value violates unique constraint!',
            read_me: 'The request data already has a row in the table.',
            allowed: (error: any, systemName: string, feature: string) => {
                console.log('allowed (unique_row_data)', error);

                return {
                    error: {
                        kind: error?.kind,
                        detail: error?.detail,
                    }
                }
            }
        },

        code: 409
    },

    'field_list_child_error': {
        more: {
            message: "Unknown the `field_list` child name in the table!",
            read_me: 'Please make sure `field_list` the array child name is valid same as the table.'
        },

        code: 400
    },

    'cannot_insert_data_with_primary_key': {
        more: {
            message: 'Cannot insert data with primary-key field!',
            read_me: 'Please delete the primary-key field in the request.'
        },

        code: 400
    },

    'mysql_insert_table_name_id_is_not_valid': {
        more: {
            message: "The primary key field name isn't valid for `MySQL`!",
            read_me: "Please check your table primary key field name. You must change the field name.",
            example: "If you have 'example' table. The primary key field must be 'example_id'."
        },

        code: 400
    },

    'missing_supporter_confirmed_feature': {
        more: {
            message: 'NoSQL database must be confirmed for editing and deleting!',
            read_me: {
                case_1: 'You must provide `nosql_supporter` key `request_confirmed: Boolean` in the request.',
                case_2: 'You could add `ignore_supporter: Boolean` in `nosql_supporter` for ignore all of nosql supporter.',
                case_3: 'Please make sure the key name.'
            },
        },

        code: 400
    },

    'incomplete_request': {
        more: {
            message: 'Incomplete request!',
            read_me: 'Please provide the valid request format.',
            allowed: (error: any, systemName: string, feature: string) => {
                return storeFields[systemName][feature];
            }
        },

        code: 400
    },

    'invalid_field_name': {
        more: {
            message: 'The field is not found!',
            read_me: 'Please check the request fields name in `set` and `where` keys!!',
            'allowed': (error: any, systemName: string, feature: string) => {
                return storeFields[systemName][feature];
            },
        },

        code: 404
    },

    'invalid_store_code': {
        more: {
            message: 'Invalid store code !!',
            read_me: 'Please check the store code in the request. Maybe it is invalid or not exist.'
        },

        code: 404
    },

    'invalid_data_type': {
        more: {
            message: 'Invalid request data type !!',
            read_me: 'Please check the request field data type in `set` and `where` keys.'
        },

        code: 400
    },

    'name_exist': {
        more: {
            message: 'The name is already exist !!'
        },

        code: 409
    },

    'secret_key_4_numbers': {
        more: {
            message: 'Secret key must be 4 numbers !!'
        },

        code: 400
    }
};