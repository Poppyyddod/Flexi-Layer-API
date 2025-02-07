type DbTypeModel = {
    [key: string]: {
        name: string,
        type: string,
        connect_state: boolean
    }
}

export const supportForDbTypes: DbTypeModel = {
    postgresql: {
        name: 'PostgreSQL',
        type: 'sql',
        connect_state: true
    },

    mysql: {
        name: 'MySQL',
        type: 'sql',
        connect_state: false
    },

    mongodb: {
        name: 'MongoDB',
        type: 'nosql',
        connect_state: true
    }
}