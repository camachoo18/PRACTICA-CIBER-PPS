import { calculateIMC, getIMCCategory } from './calculator.js';
import { saveRecord, getRecords } from './storage.js';

const form = document.getElementById('imcForm');
const resultDiv = document.getElementById('result');
const recordsList = document.getElementById('recordsList');

// Establecer fecha actual por defecto
document.getElementById('date').valueAsDate = new Date();

// Función para calcular edad
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const date = document.getElementById('date').value;

    // Validación de peso y altura
    if (isNaN(weight) || weight <= 0) {
        alert('El peso debe ser mayor a 0');
        return;
    }
    if (isNaN(height) || height <= 0) {
        alert('La altura debe ser mayor a 0');
        return;
    }
    
    const imc = calculateIMC(weight, height);
    const category = getIMCCategory(parseFloat(imc));
    const age = calculateAge(birthDate);
    
    // Mostrar información del paciente
    document.getElementById('patientInfo').innerHTML = `
        <p><strong>Paciente:</strong> ${firstName} ${lastName}</p>
        <p><strong>Edad:</strong> ${age} años</p>
        <p><strong>Fecha de Nacimiento:</strong> ${new Date(birthDate).toLocaleDateString('es-ES')}</p>
    `;
    
    // Mostrar resultado
    document.getElementById('imcValue').innerHTML = `<h3>IMC: ${imc}</h3>`;
    document.getElementById('imcCategory').innerHTML = `<p style="color: ${category.color}; font-weight: bold;">${category.category}</p>`;
    document.getElementById('imcExplanation').innerHTML = `<p>${category.explanation}</p>`;
    resultDiv.style.display = 'block';
    
    // Guardar registro
    await saveRecord(firstName, lastName, birthDate, weight, height, date);
    await loadRecords();
    
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
});

async function loadRecords() {
    const data = await getRecords();
    const records = data.records || [];
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p>No hay registros todavía.</p>';
        return;
    }
    
    recordsList.innerHTML = records
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(record => {
            const category = getIMCCategory(parseFloat(record.imc));
            const age = calculateAge(record.birthDate);
            return `
                <div class="record-item">
                    <div class="record-patient">
                        👤 ${record.firstName} ${record.lastName}
                    </div>
                    <div class="record-age">
                        Edad: ${age} años | Fecha de Nacimiento: ${new Date(record.birthDate).toLocaleDateString('es-ES')}
                    </div>
                    <div class="record-details">
                        <strong>${record.date}</strong> - 
                        Peso: ${record.weight}kg | 
                        Altura: ${record.height}cm | 
                        IMC: <span style="color: ${category.color}; font-weight: bold;">${record.imc} (${category.category})</span>
                    </div>
                </div>
            `;
        })
        .join('');
}

// Cargar registros al iniciar
loadRecords();