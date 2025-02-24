// type StoreFieldAction = {
//     [key: string]: any;
// };

// type StoreFields = {
//     [key: string]: {
//         fetch?: StoreFieldAction;
//         create?: StoreFieldAction;
//         edit?: StoreFieldAction;
//         remove:? StoreFieldAction;
//     };
// };

/**
 * ລາຍການ SQL Error ແລະ ລາຍລະອຽດ
 */

// Error About SQL Query
export const storeFields: any = {
    'Store': {
        fetch: {
            guide: {
                request_format: {
                    db_type: "#db_type (postgresql | mysql)",
                    store_code: "#store_code",
                    where: 'Key Object & Valid (Field & Data type)'
                },
                example: {
                    get_some_row: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        field_list: "[#field_name] <- array || '*' <- string ",
                        where: {
                            user_id: 0
                        }
                    },
                    get_all_row: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        field_list: "[#field_name] <- array || '*' <- string ",
                        where: "*"
                    },
                    get_last_row: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        field_list: ['#field_name', '...'],
                        where: "#primary_key_field_name:LAST:#limit_data_number"
                    }
                }
            }
        },
        create: {
            guide: {
                request_format: {
                    db_type: "###### (postgresql | mysql)",
                    store_code: "###### (#store_code)",
                    set: 'Key Object & Valid (Field & Data type) & Required (Field)',
                    time_series: 'Boolean | For NoSQL Database to insert (created_at = date, updated_at = date)'
                },
                example: {
                    db_type: "#db_type",
                    store_code: "#store_code",
                    set: {
                        email: "example@gmail.com",
                        user_name: "#name",
                        secretword: "#password"
                    },
                    time_series: "T / F (If the database type is NoSQL.)"
                }
            }
        },
        edit: {
            guide: {
                request_format: {
                    db_type: "###### (postgresql | mysql)",
                    store_code: "###### (#store_code)",
                    set: 'Key Object & Valid (Field & Data type)',
                    where: 'Key Object & Valid (Field & Data type)'
                },
                example: {
                    db_type: "#db_type",
                    store_code: "#store_code",
                    set: {
                        user_name: "#name"
                    },
                    where: {
                        user_id: 0
                    }
                }
            }
        },
        remove: {
            guide: {
                request_format: {
                    db_type: "###### (postgresql | mysql)",
                    store_code: "###### (#store_code)",
                    where: 'Key Object & Valid (Field & Data type) (not allow for remove without `where` key!!)'
                },
                example: {
                    db_type: "#db_type",
                    store_code: "#store_code",
                    where: {
                        user_id: 0
                    }
                }
            }
        }
    },

    Auth: {
        'sign-in': {
            request_format: {
                case_1: {
                    db_type: "###### (postgresql | mysql)",
                    store_code: "###### (#store_code)",
                    where: {
                        email: "example@gmail.com",
                        secretword: "#password"
                    },
                },
                case_2: {
                    db_type: "###### (postgresql | mysql)",
                    store_code: "###### (#store_code)",
                    where: {
                        user_name: "#username",
                        secretword: "#password"
                    }
                }
            },
        },
        'sign-up': {
            request_format: {
                db_type: "###### (postgresql | mysql)",
                store_code: "###### (#store_code)",
                set: {
                    email: "example@gmail.com",
                    user_name: "#username",
                    secretword: "#password"
                }
            }
        },
        'sign-out': {
            request_format: {
                db_type: "###### (postgresql | mysql)",
                store_code: "###### (#store_code)",
                where: {
                    user_id: "#user_id"
                }
            },
        }
    }
};
