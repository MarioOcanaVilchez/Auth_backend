import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { dbConnection } from './config/config';
import authRoutes from './routes/auth';

// Cuando la app carga cogemos lo de las variables de entorno:
dotenv.config();

// Creamos server
const app = express();

// Conexión a la BD:
dbConnection();

app.use(express.static(path.resolve(process.cwd(), 'src/public')));
app.use(cors());
app.use(express.json()); // lectura y parseo del request.body
app.use('/api/auth', authRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});
