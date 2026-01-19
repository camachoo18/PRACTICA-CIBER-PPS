const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');


// Almacenamiento en memoria de intentos fallidos
const loginAttempts = new Map();

// Configuración
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 15 minutos en milisegundos

function checkLoginAttempts(email) {
    const key = email.toLowerCase();
    const now = Date.now();
    
    if (!loginAttempts.has(key)) {
        loginAttempts.set(key, { count: 0, lockedUntil: null });
    }
    
    const attempts = loginAttempts.get(key);
    
    // Verificar si está bloqueado
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
        const remainingMinutes = Math.ceil((attempts.lockedUntil - now) / 60000);
        return {
            blocked: true,
            message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remainingMinutes} minuto(s)`
        };
    }
    
    // Limpiar bloqueo si ya expiró
    if (attempts.lockedUntil && now >= attempts.lockedUntil) {
        attempts.count = 0;
        attempts.lockedUntil = null;
    }
    
    return { blocked: false };
}

function recordFailedAttempt(email) {
    const key = email.toLowerCase();
    const attempts = loginAttempts.get(key);
    
    attempts.count++;
    
    // Bloquear tras alcanzar el límite
    if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }
}

function resetAttempts(email) {
    const key = email.toLowerCase();
    if (loginAttempts.has(key)) {
        loginAttempts.set(key, { count: 0, lockedUntil: null });
    }
}

// Limpieza automática cada hora
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of loginAttempts.entries()) {
        if (data.lockedUntil && now >= data.lockedUntil) {
            loginAttempts.delete(email);
        }
    }
}, 60 * 60 * 1000); // 1 hora


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

    if (password.length < 12) {
        return res.status(400).json({ 
            success: false, 
            error: 'La contraseña debe tener al menos 12 caracteres' 
        });
    }

    if (password.length > 72) {
        return res.status(400).json({ 
            success: false, 
            error: 'La contraseña no puede exceder 72 caracteres' 
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
    bcrypt.hash(password, 12, (err, hashedPassword) => {
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
        // Verificar intentos
        const attemptCheck = checkLoginAttempts(email);
            if (attemptCheck.blocked) {
                return res.status(429).json({
                    success: false,
                    error: attemptCheck.message
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
                // REGISTRAR INTENTO FALLIDO
                recordFailedAttempt(email);
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
                    // REGISTRAR INTENTO FALLIDO
                    recordFailedAttempt(email);
                    return res.status(401).json({ 
                        success: false, 
                        error: 'Email o contraseña incorrectos' 
                    });
                }

                // LOGIN EXITOSO - RESETEAR INTENTOS
                resetAttempts(email);

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