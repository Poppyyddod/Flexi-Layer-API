import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

const uri = `${process.env.MONGODB_URI}`;
const mongoDbDatabaseName = process.env.MONGODB_DATABASE;
const client = new MongoClient(uri);

const connectToMongoDB = async () => {
    try {
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
    db: client.db(mongoDbDatabaseName),
    testConnection: connectToMongoDB
}

export default obj;
