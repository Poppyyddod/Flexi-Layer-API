export type DbTypeListKey = 'mysql';

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
    }
}