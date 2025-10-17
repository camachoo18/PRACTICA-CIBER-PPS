const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/records.json');

// Obtener todos los registros
router.get('/', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json({ records: [] });
    }
});

// Guardar nuevo registro
router.post('/', (req, res) => {
    try {
        const { weight, height, date } = req.body;
        
        let records = { records: [] };
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            records = JSON.parse(data);
        } catch (error) {
            // Archivo no existe, usar objeto vacío
        }

        // Convertir altura de cm a metros para el cálculo
        const heightInMeters = parseFloat(height) / 100;
        
        const newRecord = {
            id: Date.now(),
            weight: parseFloat(weight),
            height: parseFloat(height),
            date: date || new Date().toISOString().split('T')[0],
            imc: (parseFloat(weight) / Math.pow(heightInMeters, 2)).toFixed(2)
        };

        records.records.push(newRecord);
        fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
        
        res.json({ success: true, record: newRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;