import { calculateIMC, getIMCCategory } from './calculator.js';
import { saveRecord, getRecords } from './storage.js';


const form = document.getElementById('imcForm');
const resultDiv = document.getElementById('result');
const recordsList = document.getElementById('recordsList');

// Establecer fecha actual por defecto
document.getElementById('date').valueAsDate = new Date();

//cerrar sesion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Eliminar token del localStorage
        localStorage.removeItem('token');
        
        // Redirigir a login
        window.location.href = '/login';
    });
}

// Función para calcular edad
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    // Validar que la fecha de nacimiento no sea en el futuro
    if (birth > today) {
        throw new Error('La fecha de nacimiento no puede ser en el futuro');
    }
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadRecords();
});

document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
        await loadRecords();
    }
});

/// Función auxiliar para escapar HTML
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const birthDate = document.getElementById('birthDate').value;

    if (new Date(birthDate) > new Date()) {
        alert('La fecha de nacimiento no puede ser en el futuro');
        return;
    }

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const date = document.getElementById('date').value;

    // Validación: solo letras y espacios en texto
    const onlyLettersRegex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;
    
    if (!onlyLettersRegex.test(firstName)) {
        alert('El nombre solo debe contener letras y espacios');
        return;
    }
    
    if (!onlyLettersRegex.test(lastName)) {
        alert('El apellido solo debe contener letras y espacios');
        return;
    }

    // Validación de peso y altura
    if (isNaN(weight) || weight <= 0 || weight > 300) {
        alert('El peso debe estar entre 1 y 300 kg');
        return;
    }
    if (isNaN(height) || height <= 0 || height > 250) {
        alert('La altura debe estar entre 1 y 250 cm');
        return;
    }
    
    const imc = calculateIMC(weight, height);
    const category = getIMCCategory(parseFloat(imc));
    const age = calculateAge(birthDate);
    
    // Mostrar información del paciente - ESCAPAR HTML
    const patientInfo = document.getElementById('patientInfo');
    patientInfo.innerHTML = '';
    
    const p1 = document.createElement('p');
    p1.innerHTML = `<strong>Paciente:</strong> ${escapeHTML(firstName)} ${escapeHTML(lastName)}`;
    
    const p2 = document.createElement('p');
    p2.innerHTML = `<strong>Edad:</strong> ${age} años`;
    
    const p3 = document.createElement('p');
    p3.innerHTML = `<strong>Fecha de Nacimiento:</strong> ${new Date(birthDate).toLocaleDateString('es-ES')}`;
    
    patientInfo.appendChild(p1);
    patientInfo.appendChild(p2);
    patientInfo.appendChild(p3);
    
    // Mostrar resultado
    document.getElementById('imcValue').innerHTML = `<h3>IMC: ${escapeHTML(imc)}</h3>`;
    document.getElementById('imcCategory').innerHTML = `<p style="color: ${category.color}; font-weight: bold;">${escapeHTML(category.category)}</p>`;
    document.getElementById('imcExplanation').innerHTML = `<p>${escapeHTML(category.explanation)}</p>`;
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
    
    recordsList.innerHTML = '';
    records
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(record => {
            const category = getIMCCategory(parseFloat(record.imc));
            const age = calculateAge(record.birthDate);
            
            const recordDiv = document.createElement('div');
            recordDiv.className = 'record-item';
            
            // MÉTODO SEGURO: Crear todo con createElement
            const patientDiv = document.createElement('div');
            patientDiv.className = 'record-patient';
            const avatarSpan = document.createElement('span');
            avatarSpan.textContent = '👤 ';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${record.firstName} ${record.lastName}`;
            patientDiv.appendChild(avatarSpan);
            patientDiv.appendChild(nameSpan);
            
            const ageDiv = document.createElement('div');
            ageDiv.className = 'record-age';
            const ageText = document.createElement('span');
            ageText.textContent = `Edad: ${age} años | Fecha de Nacimiento: ${new Date(record.birthDate).toLocaleDateString('es-ES')}`;
            ageDiv.appendChild(ageText);
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'record-details';
            const dateSpan = document.createElement('strong');
            dateSpan.textContent = record.date;
            const detailsText = document.createElement('span');
            detailsText.textContent = ` - Peso: ${record.weight}kg | Altura: ${record.height}cm | IMC: ${record.imc} (${category.category})`;
            const imcSpan = document.createElement('span');
            imcSpan.style.color = category.color;
            imcSpan.style.fontWeight = 'bold';
            imcSpan.textContent = `${record.imc} (${category.category})`;
            
            detailsDiv.appendChild(dateSpan);
            detailsDiv.appendChild(document.createTextNode(` - Peso: ${record.weight}kg | Altura: ${record.height}cm | IMC: `));
            detailsDiv.appendChild(imcSpan);
            
            recordDiv.appendChild(patientDiv);
            recordDiv.appendChild(ageDiv);
            recordDiv.appendChild(detailsDiv);
            
            recordsList.appendChild(recordDiv);
        });
}

// Cargar registros al iniciar
loadRecords();