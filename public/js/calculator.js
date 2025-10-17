export function calculateIMC(weight, height) {
    // Ahora height ya viene en metros, no necesita conversión
    const imc = weight / (height * height);
    return imc.toFixed(2);
}

export function getIMCCategory(imc) {
    if (imc < 18.5) {
        return {
            category: 'Bajo peso',
            color: '#3498db',
            explanation: 'Tu IMC indica bajo peso. Puede ser recomendable aumentar tu ingesta calórica de manera saludable.'
        };
    } else if (imc >= 18.5 && imc < 25) {
        return {
            category: 'Peso normal',
            color: '#2ecc71',
            explanation: 'Tu IMC está en el rango saludable. ¡Mantén tus buenos hábitos!'
        };
    } else if (imc >= 25 && imc < 30) {
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