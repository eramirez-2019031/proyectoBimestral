import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query);*/

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const usuariosPost = async (req, res) => {


    const {nombre, correo, password, role} = req.body;
    const usuario = new User( {nombre, correo, password, role} );

    //verificar si el correo existe
   
    //encriptar password
    const salt = bcryptjs.genSaltSync(); //por default tiene 10 vueltas
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar datos
    await usuario.save();

    res.status(200).json({
        usuario
    });
}

export const getUsuarioById = async (req, res) => {
    const {id} = req.params;
    const usuario = await User.findOne({_id: id});
    
    res.status(200).json({
        usuario
    })
}

export const usuariosPut = async (req, res) => {
    try {
        const { id } = req.params;
        const {nameUser, email, oldPassword, newPassword} = req.body;
 
        const usuarioAutenticado = req.usuario;
        const idCoincide = usuarioAutenticado._id.toString() === id;
        const tienePermiso = usuarioAutenticado.role === 'USER_ROLE';
 
        if (!idCoincide || !tienePermiso) {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar este usuario',
            });
        }
 
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                msg: 'Debes proporcionar tanto la contraseña anterior como la nueva para actualizar',
            });
        }
 
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado',
            });
        }
 
        const contrasenaValida = await bcryptjs.compare(oldPassword, usuario.password);
        if (!contrasenaValida) {
            return res.status(400).json({
                msg: 'La contraseña anterior no es válida',
            });
        }
 
        if (nombre) {
            usuario.nombre = nombre;
        }
        if (email) {
            usuario.email = email;
        }
 
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        usuario.password = hashedPassword;
        await usuario.save();
 
        res.status(200).json({
            msg: 'Se actualizó el perfil correctamente',
            usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const usuariosDelete = async (req, res) => {
    const {id} = req.params;


    const usuario = await User.findByIdAndUpdate(id, { estado: false});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({msg:'Usuario a eliminar', usuario, usuarioAutenticado });
}