import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';

const { HOST, PGSQL_USER, PGSQL_PASSWORD, PGSQL_DATABASE, PGSQL_PORT } = process.env;

const client = new Client({
    host: HOST,
    port: Number(PGSQL_PORT),
    user: PGSQL_USER,
    password: PGSQL_PASSWORD,
    database: PGSQL_DATABASE
});

client.connect()
    .then(() => console.log('* PostgreSQL connected successfully!'))
    .catch(err => console.error('* (Error): PostgreSQL connection error', err));

export default client;
