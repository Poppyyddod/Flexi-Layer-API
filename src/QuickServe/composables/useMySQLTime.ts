

function useTime() {
    const getLocalTimeAsISOString = () => {
        const local = new Date();
        const timezoneOffset = local.getTimezoneOffset(); // นาที
        const localTime = new Date(local.getTime() - timezoneOffset * 60 * 1000);
        return localTime.toISOString().slice(0, 23) + 'Z';
    };


    const getLocalMysqlDatetime = () => {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hour = pad(now.getHours());
        const minute = pad(now.getMinutes());
        const second = pad(now.getSeconds());

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    const now = new Date();
    const mysqlDate = now.toISOString().slice(0, 10);

    return {
        getLocalTimeAsISOString,
        getLocalMysqlDatetime,
        mysqlDate
    }
}

export default useTime;