import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

import { cartDataSave, cartDataDelete } from './cart.controller.js';
const router = Router();
router.post(
  '/',
  [
    check('Date', 'La fecha es obligatoria').not().isEmpty(),
    check('user', 'El usuario es obligatorio').not().isEmpty(),
    check('product', 'El producto es obligatorio').not().isEmpty(),
    check('howMany', 'La cantidad de productos que se va a llevar es obligatoria').not().isEmpty(),
    validarJWT,
  ],
  cartDataSave
);
router.delete(
  '/delete/:id',
  [
    
    check('id', 'el id no es un formato valido para mongo').isMongoId(),
    validarJWT,
    tieneRole('CLIENT_ROLE'),
  ],
  cartDataDelete
);

export default router;
