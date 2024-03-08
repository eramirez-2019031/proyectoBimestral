import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { categoriaPost, categoriaGet, categoriaPut, categoriaDelete } from '../categorias/categoria.controller.js';

router.get("/", categoriaGet);

router.put(
    "/put/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        validarCampos
    ], categoriaPut);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            validarCampos
        ], categoriaDelete);

        
router.post(
    "/",
    [
        check("nameCat", "El nombre no puede ir vacio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        validarCampos,
    ], categoriaPost);



export default router;