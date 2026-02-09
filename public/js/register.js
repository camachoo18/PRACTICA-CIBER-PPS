const form = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    // OBTENER TOKEN DE TURNSTILE
    const captchaToken = document.querySelector('[name="cf-turnstile-response"]')?.value;
    
    if (!captchaToken) {
        errorMessage.textContent = 'Por favor completa el Captcha';
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
                'cf-turnstile-response': captchaToken  // ENVIAR TOKEN
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
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