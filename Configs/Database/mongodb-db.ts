// import dotenv from 'dotenv';
// dotenv.config();
// import { MongoClient } from "mongodb";
// import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';

// const uri = `${process.env.MONGODB_URI}`;
// const mongoDbDatabaseName = process.env.MONGODB_DATABASE;
// // let client: any;

// const client = new MongoClient(uri);

// const connectToMongoDB = async () => {
//     try {
//         if (!supportForDbTypes.mongodb.connect_state) {
//             console.log(
//                 '\x1b[33m [WARNING] `MongoDB` disconnected! \x1b[0m \n',
//                 '\x1b[33m > The settings has disconnected `MongoDB` database. \x1b[0m \n', 
//                 '\x1b[33m > It cannot send the request for `MongoDB` database now. \x1b[0m\n',
//             );
//             return;
//         }

//         await client.connect();

//         console.log("* MongoDB connected successfully!");

//         await client.close();
//     } catch (error) {
//         console.error("* (Error) : MongoDB connection failed : ", error);
//         throw error;
//     }
// }

// interface mongoDbObj {
//     client: any,
//     db: any,
//     testConnection: any
// }

// const obj: mongoDbObj = {
//     client: client,
//     db: client?.db(mongoDbDatabaseName),
//     testConnection: connectToMongoDB
// }

// export default obj;

import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';

const uri = process.env.MONGODB_URI!;
const mongoDbDatabaseName = process.env.MONGODB_DATABASE!;

const client = new MongoClient(uri);
let db: any = null;

let isConnected = false;

const connectToMongoDB = async () => {
    if (!supportForDbTypes.mongodb.connect_state) {
        console.log(
            '\x1b[33m [WARNING] MongoDB disconnected! \x1b[0m \n',
            '\x1b[33m > The settings has disconnected MongoDB database. \x1b[0m \n',
            '\x1b[33m > It cannot send the request for MongoDB database now. \x1b[0m\n',
        );
        return;
    }

    if (isConnected) return;

    try {
        await client.connect();
        db = client.db(mongoDbDatabaseName);
        isConnected = true;
        console.log("* MongoDB connected successfully!");
    } catch (error) {
        console.error("* (Error) : MongoDB connection failed : ", error);
        throw error;
    }
}


// const connectToMongoDB = async () => {
//     try {
//         if (!supportForDbTypes.mongodb.connect_state) {
//             console.log(
//                 '\x1b[33m [WARNING] MongoDB disconnected! \x1b[0m \n',
//                 '\x1b[33m > The settings has disconnected MongoDB database. \x1b[0m \n',
//                 '\x1b[33m > It cannot send the request for MongoDB database now. \x1b[0m\n',
//             );
//             return;
//         }

//         // Check if connection is alive
//         const isConnected = async () => {
//             try {
//                 await client.db().admin().ping();
//                 return true;
//             } catch {
//                 return false;
//             }
//         }

//         if (!(await isConnected())) {
//             await client.connect();
//             db = client.db(mongoDbDatabaseName);
//             console.log("* MongoDB connected successfully!");
//         }
//     } catch (error) {
//         console.error("* (Error) : MongoDB connection failed : ", error);
//         throw error;
//     }
// }

interface mongoDbObj {
    client: typeof client,
    db: any,
    testConnection: () => Promise<void>
}

const obj: mongoDbObj = {
    client,
    db,
    testConnection: connectToMongoDB
};

export default obj;
