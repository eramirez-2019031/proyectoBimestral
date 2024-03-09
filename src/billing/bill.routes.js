import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { buyBill } from './bill.controller.js';
import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

router.post('/buyBill', [validarRol], buyBill);

export default router;