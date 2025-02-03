import argon2 from 'argon2';

export const ArgonHashPassword = async (password: string): Promise<string> => {
    try {
        const hashed = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,  // 64MB
            timeCost: 4,
            parallelism: 2
        });
        // console.log('argon2HashPassword (hashed) : ', hashed);

        return hashed;
    } catch (error) {
        console.log('argon2HashPassword (Error):', error);
        throw error;
    }
};


export const ArgonComparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const compared = await argon2.verify(hashedPassword, password);
        // console.log('ArgonComparePassword (compared) : ', compared);
        return compared;
    } catch (error) {
        console.log('ArgonComparePassword (Error):', error);
        throw error;
    }
};
