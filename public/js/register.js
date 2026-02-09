const form = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    // ✅ OBTENER TOKEN DE TURNSTILE CORRECTAMENTE
    const captchaToken = window.turnstile?.getResponse();
    
    if (!captchaToken) {
        errorMessage.textContent = 'Por favor completa el Captcha';
        errorMessage.classList.add('show');
        return;
    }

    // Validaciones básicas
    if (password !== passwordConfirm) {
        errorMessage.textContent = 'Las contraseñas no coinciden';
        errorMessage.classList.add('show');
        return;
    }

    if (password.length < 12) {
        errorMessage.textContent = 'La contraseña debe tener al menos 12 caracteres';
        errorMessage.classList.add('show');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                firstName, 
                lastName, 
                email, 
                password, 
                passwordConfirm,
                'cf-turnstile-response': captchaToken  // ✅ ENVIAR CORRECTAMENTE
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = '/app';
        } else {
            errorMessage.textContent = data.error || 'Error en el registro';
            errorMessage.classList.add('show');
            // ✅ RESET TURNSTILE DESPUÉS DE ERROR
            window.turnstile?.reset();
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error de conexión';
        errorMessage.classList.add('show');
        window.turnstile?.reset();
    }
});