const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Middleware para verificar token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Token requerido' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
}

// Register
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        return res.status(400).json({ 
            success: false, 
            error: 'Todos los campos son obligatorios' 
        });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({ 
            success: false, 
            error: 'Las contraseñas no coinciden' 
        });
    }

    if (password.length < 8) {
        return res.status(400).json({ 
            success: false, 
            error: 'La contraseña debe tener al menos 8 caracteres' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Email inválido' 
        });
    }

    // Hashear contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: 'Error al procesar la contraseña' 
            });
        }

        // Insertar usuario
        db.run(
            'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName.trim(), lastName.trim(), email.toLowerCase(), hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'El email ya está registrado' 
                        });
                    }
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Error al registrar usuario' 
                    });
                }

                const token = jwt.sign(
                    { userId: this.lastID },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.json({ 
                    success: true, 
                    message: 'Registro exitoso',
                    token,
                    userId: this.lastID
                });
            }
        );
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Email y contraseña requeridos' 
        });
    }

    db.get(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()],
        (err, user) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error en el servidor' 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Email o contraseña incorrectos' 
                });
            }

            bcrypt.compare(password, user.password, (err, isPasswordValid) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Error al verificar contraseña' 
                    });
                }

                if (!isPasswordValid) {
                    return res.status(401).json({ 
                        success: false, 
                        error: 'Email o contraseña incorrectos' 
                    });
                }

                const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.json({ 
                    success: true, 
                    message: 'Login exitoso',
                    token,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                });
            });
        }
    );
});

module.exports = { router, verifyToken };