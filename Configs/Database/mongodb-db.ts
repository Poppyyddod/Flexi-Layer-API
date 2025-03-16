import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';

const uri = `${process.env.MONGODB_URI}`;
const mongoDbDatabaseName = process.env.MONGODB_DATABASE;
// let client: any;

const client = new MongoClient(uri);

const connectToMongoDB = async () => {
    try {
        if (!supportForDbTypes.mongodb.connect_state) {
            console.log(
                '\x1b[33m [WARNING] `MongoDB` disconnected! \x1b[0m \n',
                '\x1b[33m > The settings has disconnected `MongoDB` database. \x1b[0m \n', 
                '\x1b[33m > It cannot send the request for `MongoDB` database now. \x1b[0m\n',
            );
            return;
        }

        await client.connect();

        console.log("* MongoDB connected successfully!");

        await client.close();
    } catch (error) {
        console.error("* (Error) : MongoDB connection failed : ", error);
        throw error;
    }
}

interface mongoDbObj {
    client: any,
    db: any,
    testConnection: any
}

const obj: mongoDbObj = {
    client: client,
    db: client?.db(mongoDbDatabaseName),
    testConnection: connectToMongoDB
}

export default obj;
