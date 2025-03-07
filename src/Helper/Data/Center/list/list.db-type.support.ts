type DbListKey = 'postgresql' | 'mysql' | 'mongodb';

type DbTypeModel = {
    [key: string]: {
        name: string,
        type: string,
        connect_state: boolean
    }
}

export const supportForDbTypes: DbTypeModel = {
    mysql: {
        name: 'MySQL',
        type: 'sql',
        connect_state: true
    },

    postgresql: {
        name: 'PostgreSQL',
        type: 'sql',
        connect_state: true
    },

    mongodb: {
        name: 'MongoDB',
        type: 'nosql',
        connect_state: true
    }
}