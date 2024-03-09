import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import {

  productGet,
  productPost,
  findProducts,
  productPut,
  productDelete,
  productsByCategory,
  productOrder,
} from './product.controller.js';

import { validarRol } from '../middlewares/rol-validator.js';
const router = Router();

router.get('/', productGet);

router.post(
  '/',
  [
    check('nameProduct', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('stock', 'El stock es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol,
  ],
  productPost
);

router.get('/product/:prodName', findProducts);

router.put(
  '/:id',
  [
    check('id', 'El id no es un formato válido de MongoDB').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productPut
);

router.delete(
  '/:id',
  [
    check('id', 'El id no es un formato válido de MongoDB').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productDelete
);


router.get('/category/:nameCat', productsByCategory);

router.get('/:orderReference', [ validarCampos ], productOrder);


export default router;
