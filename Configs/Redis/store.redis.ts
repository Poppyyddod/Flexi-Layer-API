// import { redisClient } from "./redis";
// import sql from "@Configs/Database";

// // ฟังก์ชันในการบันทึกชื่อตารางลง Redis
// export const storeTableNamesInRedis = async (): Promise<void> => {
//     try {
//         const [tables] = await sql.query("SHOW TABLES");
//         const tableNames = (tables as any[]).map(row => Object.values(row)[0]);
//         await redisClient.set('store_names', JSON.stringify(tableNames));

//         // const storeNames = await redisClient.keys('*');
//         // const storeNames = await redisClient.get('store_names');
//         // console.log('storeNames (storeTableNamesInRedis) : ', storeNames);

//         console.log('Store names saved to Redis.');
//         await redisClient.quit();
//     } catch (error) {
//         console.error('Error while storing table names:', error);
//     }
// };

// // // ฟังก์ชันในการดึงชื่อตารางจาก Redis และ log
// // const logTableNamesFromRedis = async (): Promise<void> => {
// //     try {
// //         // ดึงข้อมูลชื่อตารางจาก Redis
// //         const tableNames = await redisClient.get('store_names');

// //         if (tableNames) {
// //             const parsedTableNames: string[] = JSON.parse(tableNames);
// //             // log ข้อมูลชื่อตาราง
// //             console.log('Tables from Redis:', parsedTableNames);
// //         } else {
// //             console.log('No tables found in Redis.');
// //         }
// //     } catch (error) {
// //         console.error('Error while retrieving table names:', error);
// //     }
// // };

// // // ฟังก์ชันหลักที่จะรันเมื่อเซิร์ฟเวอร์เริ่มต้น
// // (async (): Promise<void> => {
// //     try {
// //         // เชื่อมต่อ Redis
// //         await redisClient.connect();

// //         // เก็บชื่อตารางใน Redis
// //         await storeTableNamesInRedis();

// //         // Log ชื่อตารางจาก Redis
// //         await logTableNamesFromRedis();

// //         // ปิดการเชื่อมต่อ Redis
// //         await redisClient.quit();
// //     } catch (error) {
// //         console.error('Error:', error);
// //     }
// // })();
