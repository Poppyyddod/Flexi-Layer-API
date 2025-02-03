/**
 * Paths ໄວ້ເກັບ log ໃນແຕ່ລະ system
 */

const systemPath = (systemName: string) => {
    const paths = {
        errorLog: `./src/${systemName}/logs/error.log`,
        warnLog: `./src/${systemName}/logs/warn.log`,
        combinedLog: `./src/${systemName}/logs/combined.log`
    };

    return paths;
}

export default systemPath;