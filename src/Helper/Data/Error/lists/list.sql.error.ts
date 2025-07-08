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
        'sql': {
            fetch: {
                guide: {
                    request_format: {
                        db_type: "#db_type (postgresql | mysql)",
                        store_code: "#store_code",
                        field_list: "[#field_name] <- array <- some column || '*' <- string <- get all column. ",
                        where: 'Key Object & Valid (Field & Data type)',
                    },
                    example: {
                        get_some_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            field_list: "[#field_name] <- array <- some column || '*' <- string <- get all column. ",
                            where: {
                                user_id: 0
                            },
                            limit: "#number_type_value <- It's the maximum value to fetch data. It's up to you.",
                        },
                        get_all_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            field_list: "[#field_name] <- array <- some column || '*' <- string <- get all column. ",
                            where: "*",
                            limit: "#number_type_value <- It's the maximum value to fetch data. It's up to you.",
                        },
                        get_last_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            field_list: "[#field_name] <- array <- some column || '*' <- string <- get all column. ",
                            where: "#primary_key_field_name:LAST:#limit"
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
                    },
                    example: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        set: {
                            email: "example@gmail.com",
                            user_name: "#name",
                            secretword: "#password"
                        },
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
            },
        },
        'nosql': {
            fetch: {
                guide: {
                    request_format: {
                        db_type: "#db_type (postgresql | mysql)",
                        store_code: "#store_code",
                        where: 'Key Object & Valid (Field & Data type)',
                    },
                    example: {
                        get_some_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            where: {
                                user_id: 0
                            },
                            limit: "#number_type_value <- It's the maximum value to fetch data. It's up to you.",
                        },
                        get_all_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            where: "*",
                            limit: "#number_type_value <- It's the maximum value to fetch data. It's up to you.",
                        },
                        get_last_row: {
                            db_type: "#db_type",
                            store_code: "#store_code",
                            where: "#field_name:LAST",
                            limit: "#number_type_value <- It's the maximum value to fetch data. It's up to you.",
                        }
                    }
                }
            },
            create: {
                guide: {
                    request_format: {
                        db_type: "###### (postgresql | mysql)",
                        store_code: "###### (#store_code)",
                        nosql_supporter: 'Key Object & Valid (Field & Data type) <- For support NoSQL Database',
                        set: 'Key Object & Valid (Field & Data type) & Required (Field)',
                        time_series: 'Boolean | For NoSQL Database to insert (created_at = date, updated_at = date)'
                    },
                    example: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        nosql_supporter: {
                            add_time_series: "true || false <- Boolean type"
                        },
                        set: {
                            email: "example@gmail.com",
                            user_name: "#name",
                        },
                    }
                }
            },
            edit: {
                guide: {
                    request_format: {
                        db_type: "###### (postgresql | mysql)",
                        store_code: "###### (#store_code)",
                        nosql_supporter: 'Key Object & Valid (Field & Data type) <- For support NoSQL Database',
                        set: 'Key Object & Valid (Field & Data type)',
                        where: 'Key Object & Valid (Field & Data type)'
                    },
                    example: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        nosql_supporter: {
                            update_time_series: "true || false <- Boolean type",
                            request_confirmed: "true || false <- Boolean type"
                        },
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
                        nosql_supporter: 'Key Object & Valid (Field & Data type) <- For support NoSQL Database',
                        where: 'Key Object & Valid (Field & Data type) (not allow for remove without `where` key!!)'
                    },
                    example: {
                        db_type: "#db_type",
                        store_code: "#store_code",
                        nosql_supporter: {
                            request_confirmed: "true || false <- Boolean type"
                        },
                        where: {
                            user_id: 0
                        }
                    }
                }
            }
        }
    },

    Auth: {
        'sql': {
            'sign-in': {
                request_format: {
                    case_1: {
                        db_type: "mysql",
                        store_code: "user_auth",
                        where: {
                            user_email: "example@gmail.com",
                            user_password: "#password"
                        }
                    },
                    case_2: {
                        db_type: "mysql",
                        store_code: "user_auth",
                        where: {
                            user_name: "#username",
                            user_password: "#password"
                        }
                    }
                },
            },
            'sign-up': {
                request_format: {
                    db_type: "mysql",
                    store_code: "user_auth",
                    set: {
                        user_email: "example@gmail.com",
                        user_name: "#username",
                        user_password: "#password"
                    }
                }
            },
            'sign-out': {
                request_format: {
                    db_type: "mysql",
                    store_code: "user_auth",
                    where: {
                        user_id: "#user_id"
                    }
                }
            },
            'refresh-token': {
                request_format: {
                    db_type: "mysql",
                    store_code: "user_refresh_tokens",
                    where: {
                        refresh_token: "#token"
                    }
                }
            }
        }
    }
};
