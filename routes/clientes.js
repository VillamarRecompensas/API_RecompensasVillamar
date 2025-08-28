const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const authMiddleware = require('../middleware/authMiddleware');

// Crear cliente
router.post('/', authMiddleware, async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json(cliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todos los clientes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un cliente por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar cliente
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        Object.assign(cliente, req.body);
        await cliente.save();
        res.json(cliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar solo puntos
router.patch('/:id/puntos', authMiddleware, async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        cliente.puntos = req.body.puntos ?? cliente.puntos;
        await cliente.save();
        res.json(cliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar cliente
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.json({ message: 'Cliente eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
