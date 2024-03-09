import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import {
  productoPost,
  getProductos,
  productoPut,
  productoDelete,
  buscarProductoPorCategoria,
} from './producto.controller.js';

import { validarRol } from '../middlewares/rol-validator.js';
const router = Router();

router.get('/', getProductos);

router.post(
  '/',
  [
    check('name', 'Se requiere un nombre').not().isEmpty(),
    check('price', 'Se requiere un precio').not().isEmpty(),
    check('category', 'Se requiere una categoria').not().isEmpty(),
    check('stock', 'Se requiere un stock').not().isEmpty(),
    validarCampos,
    validarRol,
  ],
  productoPost
);

router.put(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productoPut
);

router.delete(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productoDelete
);

router.get('/:category', buscarProductoPorCategoria);

export default router;
