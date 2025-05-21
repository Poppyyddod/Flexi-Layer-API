import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';

const { HOST, PGSQL_USER, PGSQL_PASSWORD, PGSQL_DATABASE, PGSQL_PORT } = process.env;


let client;

if (supportForDbTypes.postgresql.connect_state) {
    client = new Client({
        host: HOST,
        // host: "localhost", // <- delete it later
        port: Number(PGSQL_PORT),
        user: PGSQL_USER,
        password: PGSQL_PASSWORD,
        database: PGSQL_DATABASE
    });

    client.connect()
        .then(() => console.log('* PostgreSQL connected successfully!'))
        .catch(err => {
            console.error('* (Error): PostgreSQL connection error', err)
            process.exit(1);
        }
        );
} else {
    console.log(
        '\x1b[33m [WARNING] `PostgreSQL` disconnected! \x1b[0m \n',
        '\x1b[33m > The settings has disconnected `PostgreSQL` database. \x1b[0m \n',
        '\x1b[33m > It cannot send the request for `PostgreSQL` database now. \x1b[0m\n',
    );
    client = {};
}

export default client as any;
