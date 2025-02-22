import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';

const uri = `${process.env.MONGODB_URI}`;
const mongoDbDatabaseName = process.env.MONGODB_DATABASE;
let client: any;

const connectToMongoDB = async () => {
    try {
        if(!supportForDbTypes.mongodb.connect_state){
            console.log('\x1b[33m [WARNING] The Database setting have disconnect `MongoDB` Database! It cannot send the request for `MongoDB` database now. \x1b[0m');
            return;
        }

        client = new MongoClient(uri);

        await client.connect();

        console.log("* MongoDB connected successfully!");

        await client.close();
    } catch (error) {
        console.error("* (Error) : MongoDB connection failed : ", error);
        throw error;
    }
}

const obj = {
    client: client,
    db: client?.db(mongoDbDatabaseName),
    testConnection: connectToMongoDB
}

export default obj;
