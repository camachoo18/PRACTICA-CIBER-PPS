require('dotenv').config();
const express = require('express');
const helmet = require ('helmet');
const path = require('path');
const { router: authRouter } = require('./routes/auth');
const recordsRouter = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware seguridad HSTS
app.use(helmet());

// CSP - Política de Seguridad de Contenidos
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      "'unsafe-inline'",
      "https://challenges.cloudflare.com" // ✅ AÑADIR CLOUDFLARE TURNSTILE
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: [
      "'self'", 
      "http://localhost:*",
      "https://challenges.cloudflare.com" // ✅ AÑADIR PARA API CALLS
    ],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: [
      "'self'",
      "https://challenges.cloudflare.com" // ✅ AÑADIR PARA IFRAME DEL CAPTCHA
    ]
  }
}));


// HSTS - En desarrollo sin HTTPS, en producción lo aplica automáticamente
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts({
    maxAge: 31536000, // 1 año en segundos
    includeSubDomains: true,
    preload: true
  }));
}

// Middleware
app.use(express.json());

// ⭐ RUTAS ESPECÍFICAS ANTES DE ARCHIVOS ESTÁTICOS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter);

// ⭐ ARCHIVOS ESTÁTICOS AL FINAL
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});