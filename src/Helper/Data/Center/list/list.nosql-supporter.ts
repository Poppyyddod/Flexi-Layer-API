interface noSqlSupportListModel {
    [key: string]: {
        [key: string]: {
            for: string[],
            data_type: string,
            description: string
        }
    }
}


export const noSqlSupporterList: noSqlSupportListModel = {
    fetch: {

    },

    create: {
        "add_time_series": {
            for: ['create'],
            data_type: 'boolean',
            description: 'For add time-series(created_at, updated_at) to the data.'
        },
    },

    edit: {
        "update_time_series": {
            for: ['edit'],
            data_type: 'boolean',
            description: 'For update time-series `updated_at` in the data.'
        }
    },

    delete: {

    },

    mix: {
        "ignore_supporter": {
            for: ['fetch', 'create', 'edit', 'delete'],
            data_type: 'boolean',
            description: 'For ignore all of nosql supporter.'
        },

        "request_confirmed": {
            for: ['delete', 'edit'],
            data_type: 'boolean',
            description: 'For confirm to (delete, edit) the data as the request.'
        },
    }
}