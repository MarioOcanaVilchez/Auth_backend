import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const generateJWT = (uid: string, name: string): Promise<string> => {
    const payload = { uid, name };
    return new Promise((resolve, reject) => {
        const secret = process.env.SECRET_JWT_SEED;
        if (!secret) {
            return reject(new Error('SECRET_JWT_SEED no está definida'));
        }
        jwt.sign(
            payload,
            secret,
            { expiresIn: '24h' },
            (error, token) => {
                if (error || !token) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export const crearUsuario = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Error, usuario ya existente'
            });
        }
        const newUser = new User(req.body);
        // Hashear contraseña
        const randomNumber = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(password.toString(), randomNumber);

        // Generar el JWT y crear usuario en la BD
        const token = await generateJWT(newUser.id, newUser.name);
        await newUser.save();

        return res.status(200).json({
            ok: true,
            msg: 'Usuario creado con éxito',
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, consulte su admin'
        });
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Error, usuario no existente'
            });
        }
        // Confirmamos si la contraseña coincide
        const validPassword = bcrypt.compareSync(password.toString(), user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Error, Usuario o contraseña incorrectos'
            });
        }
        const token = await generateJWT(user.id, user.name);
        return res.status(200).json({
            ok: true,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, consulte su admin'
        });
    }
};

export const renovarUsuario = async (req: Request, res: Response) => {
    const uid = req.uid as string;

    const dbuser = await User.findById(uid);
    const userName = dbuser ? dbuser.name : (req.name as string);

    const token = await generateJWT(uid, userName);

    return res.json({
        ok: true,
        uid,
        name: userName,
        email: dbuser ? dbuser.email : undefined,
        token
    });
};
