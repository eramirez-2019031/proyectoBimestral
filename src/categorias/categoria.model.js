const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema ({
    nameCat:{
        type: String,
        required: [true, "El nombre de la caregoria es obligatorio"]
    },
    descripcion:{
        type:String,
        required: [true, "La descripcion de la caregoria es obligatoria"]
    }


});

module.exports = model ('Role', CategoriaSchema);