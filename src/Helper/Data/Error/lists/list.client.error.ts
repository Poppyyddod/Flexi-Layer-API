import { DbTypeListKey, supportForDbTypes } from "../../Center/list/list.db-type.support";
import { noSqlSupporterList } from "../../Center/list/list.nosql-supporter";
import { storeFields } from "./list.sql.error";


type Features = 'fetch' | 'create' | 'edit' | 'remove';
type StoreFieldNames = keyof typeof storeFields;

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

    'email_invalid': {
        more: {
            message: "Email is invalid!",
            read_me: "Please check `user_email` in the request. Because it is invalid."
        },

        code: 400
    },

    'username_contains_html': {
        more: {
            message: "Username contains HTML!",
            read_me: "Please check `user_name` in the request. Because it contains HTML or contain the not allow special character."
        },

        code: 400
    },

    'password_must_be_less': {
        more: {
            message: "Password must be at least 8 characters!",
            read_me: "Please check `user_password` in the request. Because it must be at least 8 characters."
        },

        code: 400
    },

    'weak_password': {
        more: {
            message: "Weak Password!",
            read_me: "Please check `user_password` in the request. Because it is weak.",
            guide: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        },

        code: 400
    },

    'username_must_be_more': {
        more: {
            message: "Username must be less than 50 characters!",
            read_me: "Please check `user_name` in the request. Because it must be at least 3 characters."
        },

        code: 400
    },

    'incorrect_password': {
        more: {
            message: "Password is incorrect!",
            read_me: "Please check `user_email` and `user_password` in the request. Because it is incorrect."
        },

        code: 401
    },

    'username_has_forbidden_words': {
        more: {
            message: "Username has forbidden words!",
            read_me: "Please check `user_name` in the request. Because it has forbidden words.",
            not_allow: ['root', 'admin', 'support', 'moderator', 'fuck', 'shit', 'bitch']
        },

        code: 400
    },

    'invalid_nosql_supporter_feature': {
        more: {
            message: 'Invalid `nosql_supporter` feature name!',
            read_me: 'Please check the request key `nosql_supporter`. Provide the valid feature name for `nosql_supporter` the feature.',
            allowed: (errorOn: any) => {
                try {
                    return {
                        list_nosql_supporter: {
                            [`${errorOn.feature}_feature`]: { ...noSqlSupporterList[errorOn.feature], ...noSqlSupporterList['mix'] }
                        }
                    };
                } catch (error) {
                    console.log("[invalid_nosql_supporter_feature] ERROR : ", error);
                }
            },
        },

        code: 400
    },

    'fetch_limit_feature_error': {
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
            allowed: (errorOn: any) => {
                try {
                    return {
                        list_nosql_supporter: {
                            [`${errorOn.feature}_feature`]: { ...noSqlSupporterList[errorOn.feature], ...noSqlSupporterList['mix'] }
                        }
                    };
                } catch (error) {
                    console.log("[invalid_nosql_supporter_feature] ERROR : ", error);
                }
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
            read_me: {
                case_1: '`db_type` is not valid name',
                case_2: 'Forgot provide `db_type` key in the request'
            },
            support_for: `${Object.keys(supportForDbTypes)?.join(", ")}`
        },

        code: 400
    },

    'unique_create_row_data': {
        more: {
            message: 'Duplicate key value violates unique constraint!',
            read_me: 'The request data already has a row in the table. You cannot create a new row !',
            allowed: (errorOn: any) => {
                try {
                    console.log('allowed (unique_create_row_data)', errorOn);

                    return {
                        error: {
                            kind: errorOn.err?.kind,
                            detail: errorOn.err?.detail,
                        }
                    }
                } catch (error) {
                    console.log("[unique_create_row_data] ERROR : ", error);
                }
            }
        },

        code: 409
    },

    'unique_edit_row_data': {
        more: {
            message: 'Duplicate key value violates unique constraint!',
            read_me: 'The request data already has a row in the table. You cannot edit the row !',
            allowed: (errorOn: any) => {
                try {
                    console.log('allowed (unique_edit_row_data)', errorOn);

                    return {
                        error: {
                            kind: errorOn.err?.kind,
                            detail: errorOn.err?.detail,
                        }
                    }
                } catch (error) {
                    console.log("[unique_edit_row_data] ERROR : ", error);
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

    'route_is_not_valid': {
        more: {
            message: "Route is invalid !",
            read_me: "Please make sure the route on client side."
        },

        code: 404
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

    'auth_setting_turn_off': {
        more: {
            message: "Cannot support the `auth`:`myId` feature!",
            read_me: {
                case_1: "[Modify] the key has `myId` value to be normal value in the request.",
                case_2: "Auth setting is turn off. Please turn on the auth setting in middleware setting file on server side."
            }
        },

        code: 400
    },

    'incomplete_request': {
        more: {
            message: 'Incomplete request!',
            read_me: 'Please provide the valid request format.',
            allowed: (errorOn: any) => {
                try {
                    const theDbType = supportForDbTypes[errorOn.db_type as DbTypeListKey];
                    console.log("[list.client.error] : ", errorOn, theDbType);
                    return storeFields[errorOn?.systemName][theDbType?.type][errorOn?.feature];
                } catch (error) {
                    console.log("[incomplete_request] ERROR : ", error);
                }
            }
        },

        code: 400
    },

    'forget_send_db_type': {
        more: {
            message: "forget_send_db_type"
        },

        code: 400
    },

    'invalid_field_name': {
        more: {
            message: 'Any field name is invalid!',
            read_me: 'Please check the request fields name in `set` and `where` keys!!',
            'allowed': (errorOn: any) => {
                try {
                    return storeFields[errorOn.systemName][errorOn.feature] || { allowed: "Allow is not found!" };
                } catch (error) {
                    console.log("[invalid_field_name] ERROR : ", error);
                }
            },
        },

        code: 404
    },

    'refresh_token_expired': {
        more: {
            message: 'The Refresh token is expired!',
            // read_me: 'Please check the store code in the request. Maybe it is invalid or not exist.'
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
            message: 'Invalid request data type!',
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
