const {Schema, model} = require('mongoose');

const RoleSchema = Schema ({
    nameProduct:{
        type:String,
        required: [true, "El nombre del producto es obligatorio"]
    },

    price:{
        type:String,
        required:[true,"el precio del producto es requerido"]
    },
    
    stock:{
        type:String,
        enum: ['Disponible','No Disponible'],
        default:'Disponible'  //valor por defecto en caso de que no se le asigne ninguno
    },
    cat:{
        type: String,
        required:[true,"El catalogo donde pertenece el producto es obligatorio"]
    }
});

module.exports = model ('Role', RoleSchema);