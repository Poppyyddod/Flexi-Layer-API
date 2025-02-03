/**
 * @function GenerateBillNumber - ສຳຫຼັບການສ້າງ Bill Number ໃໝ່
 * @returns billNumber
 * @throws {Error}
 */

// export const GenerateBillNumber = async () => {
//     try {
//         // const format = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//         const format = '0123456789';
//         let billNumber = '';

//         // Generate billNumber of the specified length
//         for (let i = 0; i < 7; i++) {
//             const randomIndex = crypto.randomInt(0, format.length);
//             billNumber += format[randomIndex];
//         }

//         console.log('Generated bill number : ', billNumber);
//         return billNumber;
//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// }



export const GenerateBillNumber = async () => {
    try {
        const now = new Date();

        // Use toISOString to get the full date and time, then slice the relevant parts
        const formattedTimestamp = now.toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            fractionalSecondDigits: 3,
        } as any).replace(/[^\d]/g, '');

        // console.log(formattedTimestamp);

        console.log('Generated bill number : ', formattedTimestamp);
        return formattedTimestamp;
    } catch (err) {
        console.log(err);
        throw err;
    }
}