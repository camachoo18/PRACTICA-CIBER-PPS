const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken } = require('./auth');
const authorize = require('../middleware/authorization');

// ✅ GET - Obtener todos los usuarios (solo admin)
router.get('/users', verifyToken, authorize('admin'), (req, res) => {
    db.all(
        'SELECT id, firstName, lastName, email, role, createdAt FROM users ORDER BY createdAt DESC',
        (err, users) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener usuarios' 
                });
            }
            res.json({ 
                success: true, 
                users: users || [],
                totalUsers: users ? users.length : 0
            });
        }
    );
});

// ✅ DELETE - Eliminar usuario (solo admin)
router.delete('/users/:userId', verifyToken, authorize('admin'), (req, res) => {
    const { userId } = req.params;

    // Validar que no intente eliminar a sí mismo
    if (parseInt(userId) === req.userId) {
        return res.status(400).json({ 
            success: false, 
            error: 'No puedes eliminarte a ti mismo' 
        });
    }

    db.run(
        'DELETE FROM users WHERE id = ?',
        [userId],
        function(err) {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al eliminar usuario' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Usuario no encontrado' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Usuario eliminado correctamente' 
            });
        }
    );
});

// ✅ PUT - Editar usuario (solo admin)
router.put('/users/:userId', verifyToken, authorize('admin'), (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email, role } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !role) {
        return res.status(400).json({ 
            success: false, 
            error: 'Todos los campos son requeridos' 
        });
    }

    // Roles válidos
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Rol inválido. Valores permitidos: user, admin' 
        });
    }

    db.run(
        'UPDATE users SET firstName = ?, lastName = ?, email = ?, role = ? WHERE id = ?',
        [firstName.trim(), lastName.trim(), email.toLowerCase(), role, userId],
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
                    error: 'Error al actualizar usuario' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Usuario no encontrado' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Usuario actualizado correctamente' 
            });
        }
    );
});

// ✅ GET - Dashboard stats (solo admin)
router.get('/dashboard/stats', verifyToken, authorize('admin'), (req, res) => {
    db.get(
        'SELECT COUNT(*) as totalUsers FROM users',
        (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener estadísticas' 
                });
            }

            db.get(
                'SELECT COUNT(*) as totalRecords FROM records',
                (err, recordsResult) => {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            error: 'Error al obtener estadísticas' 
                        });
                    }

                    res.json({ 
                        success: true, 
                        stats: {
                            totalUsers: result.totalUsers,
                            totalRecords: recordsResult.totalRecords
                        }
                    });
                }
            );
        }
    );
});

module.exports = router;