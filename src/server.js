// filepath: src/server.js
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Cargado' : '❌ NO CARGADO');
console.log('NODE_ENV:', process.env.NODE_ENV);

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const { router: authRouter } = require('./routes/auth');
const recordsRouter = require('./routes/records');
const adminRouter = require('./routes/admin');
const { swaggerUi, specs } = require('./swagger');

const testExfiltrationRouter = require('./routes/test-exfiltration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      "'unsafe-inline'",
      "https://challenges.cloudflare.com"  // ✅ TURNSTILE SCRIPTS
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: [
      "'self'", 
      "http://localhost:*",
      "https://challenges.cloudflare.com"  // ✅ TURNSTILE API
    ],
    frameSrc: [
      "'self'",
      "https://challenges.cloudflare.com"  // ✅ TURNSTILE IFRAME
    ],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"]
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ DOCUMENTACIÓN API - SWAGGER
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true
  }
}));

// Ruta para descargar spec como JSON
app.get('/api-docs/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Página de inicio con acceso a documentación
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sistema de Registro IMC - API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 500px;
        }
        h1 {
          color: #667eea;
          margin-bottom: 20px;
          font-size: 2.5em;
        }
        p {
          color: #666;
          margin: 15px 0;
          font-size: 1.1em;
        }
        .links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 30px;
        }
        a {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          transition: background 0.3s;
        }
        a:hover {
          background: #764ba2;
        }
        .secondary {
          background: #2ecc71;
        }
        .secondary:hover {
          background: #27ae60;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏥 Sistema de Registro de IMC</h1>
        <p>API REST con autenticación JWT y WAF ModSecurity</p>
        <div class="links">
          <a href="/login">🔐 Ir a la Aplicación</a>
          <a href="/api-docs" class="secondary">📚 Ver Documentación API (Swagger)</a>
        </div>
      </div>
    </body>
    </html>
  `);
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

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter);
app.use('/api/admin', adminRouter);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test-exfil', testExfiltrationRouter);
  console.log('⚠️  Endpoints de prueba de exfiltración habilitados');
}

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs\n`);
});