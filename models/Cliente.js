const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    apellido2: { type: String },
    correo: { type: String, required: true, unique: true },
    numero: { type: Number, required: true },
    ciudad: { type: String },
    puntos: { type: Number, default: 0 },
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', clienteSchema);
