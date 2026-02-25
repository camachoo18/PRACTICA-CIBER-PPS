const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Almacenamiento en memoria de intentos fallidos
const loginAttempts = new Map();

// Configuración rete limit
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutos

function checkLoginAttempts(email) {
    const key = email.toLowerCase();
    const now = Date.now();
    
    if (!loginAttempts.has(key)) {
        loginAttempts.set(key, { count: 0, lockedUntil: null });
    }
    
    const attempts = loginAttempts.get(key);
    
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
        const remainingMinutes = Math.ceil((attempts.lockedUntil - now) / 60000);
        return {
            blocked: true,
            message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remainingMinutes} minuto(s)`
        };
    }
    
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
}, 60 * 60 * 1000);

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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario con validación de CAPTCHA Turnstile
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - passwordConfirm
 *               - cf-turnstile-response
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: José
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: López
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 12
 *                 maxLength: 72
 *                 description: Mínimo 12 caracteres
 *                 example: MiContraseña123456
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 minLength: 12
 *                 maxLength: 72
 *                 example: MiContraseña123456
 *               cf-turnstile-response:
 *                 type: string
 *                 description: Token de CAPTCHA Cloudflare Turnstile
 *                 example: 0x4AAAAAACSJOl...
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registro exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 role:
 *                   type: string
 *                   example: user
 *       400:
 *         description: Error de validación o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               captcha_missing:
 *                 summary: CAPTCHA requerido
 *                 value:
 *                   success: false
 *                   error: Por favor completa el Captcha
 *               password_mismatch:
 *                 summary: Contraseñas no coinciden
 *                 value:
 *                   success: false
 *                   error: Las contraseñas no coinciden
 *               email_exists:
 *                 summary: Email ya registrado
 *                 value:
 *                   success: false
 *                   error: El email ya está registrado
 *               invalid_password:
 *                 summary: Contraseña muy corta
 *                 value:
 *                   success: false
 *                   error: La contraseña debe tener entre 12 y 72 caracteres
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Register - VALIDAR CAPTCHA CON SECRET KEY
router.post('/register', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        password, 
        passwordConfirm, 
        'cf-turnstile-response': captchaToken 
    } = req.body;

    // VALIDAR QUE CAPTCHA ESTÉ PRESENTE
    if (!captchaToken) {
        return res.status(400).json({ 
            success: false, 
            error: 'Por favor completa el Captcha' 
        });
    }

    try {
        //  VALIDAR CON CLOUDFLARE USANDO SECRET KEY
        const captchaResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    secret: process.env.RECAPTCHA_SECRET_KEY,  // SECRET KEY DEL .env
                    response: captchaToken
                })
            }
        );

        const captchaData = await captchaResponse.json();

        console.log('🔍 Respuesta Captcha:', {
            success: captchaData.success,
            score: captchaData.score,
            error_codes: captchaData['error-codes']
        });

        // VERIFICAR RESULTADO DEL CAPTCHA
        if (!captchaData.success) {
            console.warn('⚠️ Captcha fallido:', captchaData['error-codes']);
            return res.status(400).json({ 
                success: false, 
                error: 'Validación de Captcha fallida. Por favor intenta de nuevo.' 
            });
        }

        // Validaciones de contraseña
        if (!password || !passwordConfirm) {
            return res.status(400).json({ 
                success: false, 
                error: 'Contraseña requerida' 
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ 
                success: false, 
                error: 'Las contraseñas no coinciden' 
            });
        }

        if (password.length < 12 || password.length > 72) {
            return res.status(400).json({ 
                success: false, 
                error: 'La contraseña debe tener entre 12 y 72 caracteres' 
            });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email inválido' 
            });
        }

        // Validar nombres
        if (!firstName || !lastName) {
            return res.status(400).json({ 
                success: false, 
                error: 'Nombre y apellido requeridos' 
            });
        }

        // Hashear contraseña
        bcrypt.hash(password, 12, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al procesar la contraseña' 
                });
            }

        db.run(
            'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [firstName.trim(), lastName.trim(), email.toLowerCase(), hashedPassword, 'user'],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'El email ya está registrado' 
                        });
                    }
                    console.error('Error inserción BD:', err);
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
                    userId: this.lastID,
                    role: 'user'  // ENVIAR ROLE
                });
            }
        );
    });

    } catch (error) {
        console.error('❌ Error validando Captcha:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Error al validar Captcha. Intenta más tarde.' 
        });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT válido por 7 días
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiContraseña123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 token:
 *                   type: string
 *                   description: JWT token válido por 7 días
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Email y contraseña requeridos
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Email o contraseña incorrectos
 *       429:
 *         description: Demasiados intentos fallidos (Rate limiting - 3 intentos en 5 minutos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Demasiados intentos. Intenta de nuevo en 5 minutos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Email y contraseña requeridos' 
        });
    }

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
                    recordFailedAttempt(email);
                    return res.status(401).json({ 
                        success: false, 
                        error: 'Email o contraseña incorrectos' 
                    });
                }

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
                        email: user.email,
                        role: user.role  // ENVIAR rol
                    }
                });
            });
        }
    );
});

module.exports = { router, verifyToken };