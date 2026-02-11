const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const messageDiv = document.getElementById('message');
let currentEditingUserId = null;

// ✅ Verificar autenticación
if (!token) {
    console.log('❌ No hay token, redirigiendo a login');
    window.location.href = '/login';
} else if (user.role !== 'admin') {
    console.log('❌ Usuario no es admin, redirigiendo a /app');
    window.location.href = '/app';
}

//console.log('✅ Admin autenticado:', user.email);

// ✅ Cerrar sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        console.log('🔓 Cerrando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    });
}

// ✅ Cerrar modal
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        // console.log('📋 Cerrando modal');
        editModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        // console.log('📋 Cerrando modal por click fuera');
        editModal.style.display = 'none';
    }
});

// ✅ Mostrar mensaje
function showMessage(text, type = 'success') {
    // console.log(`📢 ${type.toUpperCase()}: ${text}`);
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 4000);
}

// ✅ Cargar estadísticas
async function loadStats() {
    // console.log('📊 Cargando estadísticas...');
    try {
        const response = await fetch('/api/admin/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log('📊 Respuesta stats:', response.status);
        const data = await response.json();

        if (data.success) {
            // console.log('✅ Stats cargados:', data.stats);
            document.getElementById('totalUsers').textContent = data.stats.totalUsers;
            document.getElementById('totalRecords').textContent = data.stats.totalRecords;
        } else {
            console.error('❌ Error en stats:', data.error);
        }
    } catch (error) {
        console.error('❌ Error cargando stats:', error);
    }
}

// ✅ Cargar usuarios
async function loadUsers() {
    // console.log('👥 Cargando usuarios...');
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log('👥 Respuesta usuarios:', response.status);
        const data = await response.json();

        if (data.success) {
            // console.log('✅ Usuarios cargados:', data.users.length);
            const tbody = document.getElementById('usersList');
            tbody.innerHTML = '';

            if (data.users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No hay usuarios</td></tr>';
                return;
            }

            data.users.forEach(u => {
                const row = document.createElement('tr');
                const createdAt = new Date(u.createdAt).toLocaleDateString('es-ES');
                const roleClass = u.role === 'admin' ? 'role-admin' : 'role-user';
                const roleText = u.role === 'admin' ? 'Administrador' : 'Usuario';

                row.innerHTML = `
                    <td>${u.firstName} ${u.lastName}</td>
                    <td>${u.email}</td>
                    <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                    <td>${createdAt}</td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" data-userid="${u.id}" data-firstname="${u.firstName}" data-lastname="${u.lastName}" data-email="${u.email}" data-role="${u.role}">
                                ✏️ Editar
                            </button>
                            <button class="btn-delete" data-userid="${u.id}">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // ✅ Agregar event listeners a botones después de crear
            attachButtonListeners();
        } else {
            console.error('❌ Error:', data.error);
            showMessage('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        showMessage('Error al cargar usuarios', 'error');
    }
}

// ✅ Agregar event listeners a botones
function attachButtonListeners() {
    // Botones Editar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = btn.getAttribute('data-userid');
            const firstName = btn.getAttribute('data-firstname');
            const lastName = btn.getAttribute('data-lastname');
            const email = btn.getAttribute('data-email');
            const role = btn.getAttribute('data-role');
            
            // console.log('✏️ Editando usuario:', userId);
            openEditModal(userId, firstName, lastName, email, role);
        });
    });

    // Botones Eliminar
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = btn.getAttribute('data-userid');
            // console.log('🗑️ Eliminando usuario:', userId);
            deleteUser(userId);
        });
    });
}

// ✅ Abrir modal de edición
function openEditModal(userId, firstName, lastName, email, role) {
    // console.log('📋 Abriendo modal para usuario:', userId);
    currentEditingUserId = userId;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
    editModal.style.display = 'block';
}

// ✅ Guardar cambios de usuario
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('editFirstName').value.trim();
        const lastName = document.getElementById('editLastName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const role = document.getElementById('editRole').value;

        // console.log('💾 Guardando cambios para usuario:', currentEditingUserId);

        try {
            const response = await fetch(`/api/admin/users/${currentEditingUserId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, role })
            });

            // console.log('💾 Respuesta PUT:', response.status);
            const data = await response.json();

            if (data.success) {
                // console.log('✅ Usuario actualizado');
                showMessage('Usuario actualizado correctamente', 'success');
                editModal.style.display = 'none';
                await loadUsers();
            } else {
                // console.error('❌ Error:', data.error);
                showMessage('Error: ' + data.error, 'error');
            }
        } catch (error) {
            // console.error('❌ Error actualizando usuario:', error);
            showMessage('Error al actualizar usuario', 'error');
        }
    });
}

// ✅ Eliminar usuario
async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        // console.log('❌ Eliminación cancelada');
        return;
    }

    // console.log('🗑️ Eliminando usuario:', userId);

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log('🗑️ Respuesta DELETE:', response.status);
        const data = await response.json();

        if (data.success) {
           // console.log('✅ Usuario eliminado');
            showMessage('Usuario eliminado correctamente', 'success');
            await loadUsers();
        } else {
            // console.error('❌ Error:', data.error);
            showMessage('Error: ' + data.error, 'error');
        }
    } catch (error) {
        // console.error('❌ Error eliminando usuario:', error);
        showMessage('Error al eliminar usuario', 'error');
    }
}

// ✅ Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    //console.log('🚀 Inicializando Dashboard Admin');
    await loadStats();
    await loadUsers();
});