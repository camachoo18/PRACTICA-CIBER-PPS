const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken } = require('./auth');


/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Obtener registros del usuario autenticado
 *     description: Retorna todos los registros IMC del usuario autenticado, ordenados por fecha descendente
 *     tags:
 *       - Registros IMC
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Registros obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Record'
 *       401:
 *         description: No autenticado - Token requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Token requerido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET - Obtener registros del usuario autenticado
router.get('/', verifyToken, (req, res) => {
    db.all(
        'SELECT * FROM records WHERE userId = ? ORDER BY date DESC',
        [req.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener registros' 
                });
            }
            res.json({ success: true, records: rows || [] });
        }
    );
});

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Crear nuevo registro de IMC
 *     description: Calcula y guarda un nuevo registro de IMC para el usuario autenticado
 *     tags:
 *       - Registros IMC
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - birthDate
 *               - weight
 *               - height
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: José María
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: López Martínez
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: '1990-01-15'
 *               weight:
 *                 type: number
 *                 minimum: 0.1
 *                 maximum: 300
 *                 example: 75.5
 *                 description: Peso en kilogramos
 *               height:
 *                 type: number
 *                 minimum: 50
 *                 maximum: 250
 *                 example: 182.5
 *                 description: Altura en centímetros
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2025-02-05'
 *                 description: Fecha del registro (opcional, se usa la fecha actual si no se proporciona)
 *     responses:
 *       200:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 record:
 *                   $ref: '#/components/schemas/Record'
 *       400:
 *         description: Error de validación - Campos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_fields:
 *                 summary: Campos obligatorios faltantes
 *                 value:
 *                   success: false
 *                   error: Todos los campos son obligatorios
 *               invalid_weight:
 *                 summary: Peso inválido
 *                 value:
 *                   success: false
 *                   error: El peso debe ser mayor a 0
 *               invalid_height:
 *                 summary: Altura inválida
 *                 value:
 *                   success: false
 *                   error: La altura debe estar entre 50 y 250 cm
 *       401:
 *         description: No autenticado - Token requerido
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
 *             example:
 *               success: false
 *               error: Error al guardar el registro
 */

// POST - Crear nuevo registro
router.post('/', verifyToken, (req, res) => {
    const { firstName, lastName, birthDate, weight, height, date } = req.body;

    // Validaciones
    if (!firstName || !lastName || !birthDate || !weight || !height) {
        return res.status(400).json({ 
            success: false, 
            error: 'Todos los campos son obligatorios' 
        });
    }

    if (weight <= 0 || weight > 300 || height <= 0 || height > 250) {
        return res.status(400).json({ 
            success: false, 
            error: 'El peso debe estar entre 1-300 kg y altura entre 1-250 cm' 
        });
    }

    // Calcular IMC
    const heightInMeters = parseFloat(height) / 100;
    const imc = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    const recordDate = date || new Date().toISOString().split('T')[0];

    db.run(
        'INSERT INTO records (userId, firstName, lastName, birthDate, weight, height, imc, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.userId, firstName.trim(), lastName.trim(), birthDate, parseFloat(weight), parseFloat(height), imc, recordDate],
        function(err) {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al guardar registro' 
                });
            }

            res.json({ 
                success: true, 
                record: {
                    id: this.lastID,
                    userId: req.userId,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    birthDate,
                    weight: parseFloat(weight),
                    height: parseFloat(height),
                    imc,
                    date: recordDate
                }
            });
        }
    );
});

module.exports = router;