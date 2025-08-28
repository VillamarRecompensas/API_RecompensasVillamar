require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');

const app = express();
app.use(express.json()); // necesario para leer JSON

//habilita cors (por defecto permite todos los orígenes)
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app; // necesario para Vercel