import mongoose from 'mongoose';

export const dbConnection = async (): Promise<void> => {
    try {
        const connectionString = process.env.conection;
        if (!connectionString) {
            throw new Error('La variable de entorno "conection" no está definida');
        }
        await mongoose.connect(connectionString);
        console.log('BASE DE DATOS CONECTADA');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
};
