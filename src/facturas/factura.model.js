const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema ({
    usuarioF: {
        type: String,
        required: [true, 'El usuario es obligatorio']
    },
    productoF: {
        type: String,
        required: [true, 'El producto es obligatorio']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es obligatoria']
    },
    descipcionF: {
        type: String,
        required: [true, 'La descipcion es obligatoria']
    }
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);