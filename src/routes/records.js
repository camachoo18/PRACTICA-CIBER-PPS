const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyToken } = require('./auth');

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