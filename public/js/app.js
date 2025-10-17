import { calculateIMC, getIMCCategory } from './calculator.js';
import { saveRecord, getRecords } from './storage.js';

const form = document.getElementById('imcForm');
const resultDiv = document.getElementById('result');
const recordsList = document.getElementById('recordsList');

// Establecer fecha actual por defecto
document.getElementById('date').valueAsDate = new Date();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const date = document.getElementById('date').value;
    
    const imc = calculateIMC(weight, height);
    const category = getIMCCategory(parseFloat(imc));
    
    // Mostrar resultado
    document.getElementById('imcValue').innerHTML = `<h3>IMC: ${imc}</h3>`;
    document.getElementById('imcCategory').innerHTML = `<p style="color: ${category.color}; font-weight: bold;">${category.category}</p>`;
    document.getElementById('imcExplanation').innerHTML = `<p>${category.explanation}</p>`;
    resultDiv.style.display = 'block';
    
    // Guardar registro
    await saveRecord(weight, height, date);
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
            return `
                <div class="record-item">
                    <strong>${record.date}</strong> - 
                    Peso: ${record.weight}kg | 
                    Altura: ${record.height}cm | 
                    IMC: <span style="color: ${category.color}">${record.imc} (${category.category})</span>
                </div>
            `;
        })
        .join('');
}

// Cargar registros al iniciar
loadRecords();