import { Router } from 'express';
import { check } from 'express-validator';
import { crearUsuario, loginUsuario, renovarUsuario } from '../controller/controller';
import { validarCampos } from '../middlewares/validarCampos';
import { validarJWT } from '../middlewares/validarjws';

const router = Router();

// Crear nuevo usuario
router.post(
    '/new',
    [
        check('name', 'El nombre  es un campo obligatorio!').not().isEmpty(),
        check('email', 'El email es un campo obligatorio!').isEmail(),
        check('password', 'La contraseña es obligatoria!').isLength({ min: 5 }),
        validarCampos
    ],
    crearUsuario
);

// Login de usuario con array de middlewares que esta ruta evaluará antes de llegar al controlador
router.post(
    '/',
    [
        check('email', 'El email es un campo obligatorio!').isEmail(),
        check('password', 'La contraseña es obligatoria!').isLength({ min: 5 }),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT, renovarUsuario);

export default router;
