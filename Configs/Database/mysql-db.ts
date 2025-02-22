import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';


let connection;

if (supportForDbTypes.mysql.connect_state) {
    /**
     * ENV Database configs
     */
    const { HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;


    /**
     * @connection 
     * ສຳຫຼັບການສ້າງການເຊື່ອມຕໍ່ກັບ Database ດ້ວຍ Pool
     */

    connection = mysql.createPool({
        host: HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        // connectionLimit: 10,
        // queueLimit: 0,
    });


    /**
     * ສຳຫຼັບການເປີດການເຊື່ອມຕໍ່ ແລະ ກວດສອບ Error
     */

    connection.getConnection()
        .then(() => console.log('* MySQL connected successfully!'))
        .catch((error) => {
            console.error('* (Error): MySQL connection failed:', error);
            process.exit(1);
        });
} else {
    console.log('\x1b[33m [WARNING] The Database setting have disconnect `MySQL` Database! It cannot send the request for `MySQL` database now. \x1b[0m');
    connection = {};
}

export default connection as any;


