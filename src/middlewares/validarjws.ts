import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            uid?: string;
            name?: string;
        }
    }
}

interface CustomJwtPayload extends JwtPayload {
    uid: string;
    name: string;
}

export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        });
    }

    try {
        const secret = process.env.SECRET_JWT_SEED;
        if (!secret) {
            throw new Error('SECRET_JWT_SEED no está definida');
        }
        const { uid, name } = jwt.verify(token, secret) as CustomJwtPayload;
        req.uid = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
};
