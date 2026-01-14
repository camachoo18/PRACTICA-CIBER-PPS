const token = localStorage.getItem('token');

// Redirigir solo si intentas acceder a /app sin token
if (!token && window.location.pathname === '/app') {
    window.location.href = '/login';
}

if (token && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    window.location.href = '/app';
}

export async function getRecords() {
    if (!token) {
        return { success: false, records: [] };
    }
    
    const response = await fetch('/api/records', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        console.error('Error al obtener registros:', response.status);
        return { success: false, records: [] };
    }
    
    return await response.json();
}

export async function saveRecord(firstName, lastName, birthDate, weight, height, date) {
    if (!token) {
        throw new Error('No hay sesión activa');
    }
    
    const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            firstName, 
            lastName, 
            birthDate, 
            weight, 
            height, 
            date 
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar registro');
    }
    
    return await response.json();
}