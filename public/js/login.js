const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/app';
        } else {
            errorMessage.textContent = data.error;
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Error de conexión';
        errorMessage.classList.add('show');
    }
});