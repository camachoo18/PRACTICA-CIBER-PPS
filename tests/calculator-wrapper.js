/**
 * Wrapper de calculator.js para compatibilidad con Jest/Node.js
 * Reimplementa las funciones usando CommonJS
 */

function calculateIMC(weight, height) {
    // Validaciones
    if (weight === null || weight === undefined || height === null || height === undefined) {
        throw new Error('El peso y la altura son requeridos');
    }
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (isNaN(weightNum) || isNaN(heightNum)) {
        throw new Error('El peso y la altura deben ser valores numéricos');
    }
    
    if (weightNum <= 0) {
        throw new Error('El peso debe ser mayor a 0');
    }
    
    if (heightNum <= 0) {
        throw new Error('La altura debe ser mayor a 0');
    }
    
    // Convertir altura de centímetros a metros
    const heightInMeters = heightNum / 100;
    const imc = weightNum / (heightInMeters * heightInMeters);
    return imc.toFixed(2);
}

function getIMCCategory(imc) {
    // Validaciones
    if (imc === null || imc === undefined) {
        throw new Error('El IMC es requerido');
    }
    
    const imcNum = parseFloat(imc);
    
    if (isNaN(imcNum)) {
        throw new Error('El IMC debe ser un valor numérico');
    }
    
    if (imcNum <= 0) {
        throw new Error('El IMC debe ser mayor a 0');
    }
    
    if (imcNum < 18.5) {
        return {
            category: 'Bajo peso',
            color: '#3498db',
            explanation: 'Tu IMC indica bajo peso. Puede ser recomendable aumentar tu ingesta calórica de manera saludable.'
        };
    } else if (imcNum >= 18.5 && imcNum < 25) {
        return {
            category: 'Peso normal',
            color: '#2ecc71',
            explanation: 'Tu IMC está en el rango saludable. ¡Mantén tus buenos hábitos!'
        };
    } else if (imcNum >= 25 && imcNum < 30) {
        return {
            category: 'Sobrepeso',
            color: '#f39c12',
            explanation: 'Tu IMC indica sobrepeso. Considera adoptar una dieta equilibrada y aumentar la actividad física.'
        };
    } else {
        return {
            category: 'Obesidad',
            color: '#e74c3c',
            explanation: 'Tu IMC indica obesidad. Es recomendable consultar con un profesional de la salud para un plan personalizado.'
        };
    }
}

module.exports = { calculateIMC, getIMCCategory };