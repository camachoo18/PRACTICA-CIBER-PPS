/**
 * 🔴 ENDPOINTS DE PRUEBA 

 * 
 * Propósito: Demostrar que ModSecurity bloquea respuestas
 * con información sensible (outbound filtering)
 */

const express = require('express');
const router = express.Router();

// Test 1: Simula devolución de /etc/passwd
router.get('/test-passwd', (req, res) => {
  const passwdContent = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/sys:/usr/sbin/nologin
sync:x:4:4:sync:/bin:/bin/sync
games:x:5:5:games:/usr/games:/usr/sbin/nologin`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(passwdContent);
});

// Test 2: Simula volcado de base de datos
router.get('/test-db-dump', (req, res) => {
  const dbDump = `Database Dump - Production
============================
Table: users
id,email,password_hash,created_at
1,admin@example.com,sha256$abc123def456,2025-01-01 10:00:00
2,user@example.com,sha256$xyz789uvw012,2025-01-02 11:30:00
3,test@example.com,sha256$plaintext_pass_123,2025-01-03 14:15:00

Table: records
id,userId,weight,height,imc,createdAt
1,1,75.5,182,22.8,2025-02-01 10:30:00
2,1,76.0,182,22.9,2025-02-02 10:30:00`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(dbDump);
});

// Test 3: Stack trace de error con información sensible
router.get('/test-stack-trace', (req, res) => {
  const errorStack = `ERROR: Database Connection Failed
===================================
at connectDatabase (/app/src/database/db.js:45:12)
at Object.<anonymous> (/app/src/server.js:12:3)

Detalles de Conexión:
- Database Host: prod-db.internal.company.com
- Database Port: 5432
- Database Name: imc_production
- Username: admin_user
- Password: SecurePass123!456

Stack de Conexión:
  Error: ECONNREFUSED 172.20.0.3:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:47)`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(errorStack);
});

// Test 4: Credenciales y claves API en HTML
router.get('/test-credentials', (req, res) => {
  const html = `<!DOCTYPE html>
<html>
<head><title>API Credentials</title></head>
<body>
<h1>⚠️ API Credentials (SENSIBLE)</h1>
<pre>
AWS_ACCESS_KEY_ID=AKIA3JQ5EXAMPLE1234
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
DATABASE_URL=postgresql://admin:MySecurePass123@prod-db:5432/imc_db
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xyz
API_KEY=sk-proj-abc123def456xyz789uvw012
STRIPE_SECRET_KEY=sk_live_4eC39HqLyjWDarhu8yNeqYyL
</pre>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Test 5: JSON con información sensible
router.get('/test-json-leak', (req, res) => {
  const jsonData = JSON.stringify({
    success: true,
    users: [
      {
        id: 1,
        email: "admin@company.com",
        password_hash: "bcrypt$2b$12$abcdefghijklmnopqrstuv",
        ssn: "123-45-6789",
        credit_card: "4532-1234-5678-9010"
      },
      {
        id: 2,
        email: "user@company.com",
        password_hash: "bcrypt$2b$12$zyxwvutsrqponmlkjihgfed",
        ssn: "987-65-4321",
        credit_card: "5425-4321-0987-6543"
      }
    ],
    database_version: "PostgreSQL 13.5",
    server_path: "/var/www/app"
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
});

// Test 6: Información de configuración del sistema
router.get('/test-sysinfo', (req, res) => {
  const sysinfo = `System Information Dump
=======================
OS: Linux prod-server 5.10.0-8-amd64 #1 SMP Debian
Kernel: 5.10.0-8-amd64
Hostname: prod-db-01.internal
IP Address: 172.20.0.5
Memory: 16GB
Disk: /dev/sda1 mounted at /

Running Services:
- PostgreSQL 13.5 on port 5432
- Redis 6.2 on port 6379
- Node.js 18.0.0 running app at 0.0.0.0:3000

Installed Packages:
node v18.0.0
npm 8.0.0
postgres-contrib
redis-tools`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(sysinfo);
});

module.exports = router;