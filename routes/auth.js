const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar usuario
router.post('/register', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword 
        });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const userData = {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            points: user.points
        };
        
        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            token,
            user: userData
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ 
                message: `Ya existe un usuario con este ${field === 'username' ? 'nombre de usuario' : 'email'}` 
            });
        }
        res.status(400).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Permitir login con username o email
        const user = await User.findOne({ 
            $or: [
                { username: username || email },
                { email: email || username }
            ]
        });
        
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const userData = {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            points: user.points
        };
        
        res.json({ 
            token, 
            user: userData 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
