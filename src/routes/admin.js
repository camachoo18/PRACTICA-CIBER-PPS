const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken } = require('./auth');
const authorize = require('../middleware/authorization');


/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener todos los usuarios (admin)
 *     description: Lista todos los usuarios registrados. Solo accesible por administradores
 *     tags:
 *       - Administración
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalUsers:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sin permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Eliminar usuario (admin)
 *     description: Elimina un usuario del sistema. Solo accesible por administradores
 *     tags:
 *       - Administración
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *                   example: Usuario eliminado correctamente
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sin permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas del dashboard (admin)
 *     description: Retorna estadísticas generales del sistema incluyendo total de usuarios y registros
 *     tags:
 *       - Administración
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 42
 *                     totalRecords:
 *                       type: integer
 *                       example: 156
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sin permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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