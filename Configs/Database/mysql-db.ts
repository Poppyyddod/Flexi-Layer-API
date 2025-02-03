import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();


/**
 * ENV Database configs
 */
const { HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;


/**
 * @connection 
 * ສຳຫຼັບການສ້າງການເຊື່ອມຕໍ່ກັບ Database ດ້ວຍ Pool
 */

const connection = mysql.createPool({
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

export default connection;
