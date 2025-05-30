export type DbTypeListKey = 'postgresql' | 'mysql' | 'mongodb';

type DbTypeModel = {
    [key in DbTypeListKey]: {
        name: string;
        type: string;
        connect_state: boolean;
    };
};

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