/**
 * 🔴 ENDPOINTS DE PRUEBA - SOLO PARA DEMOSTRACIÓN (3.4)
 * ⚠️ ELIMINAR EN PRODUCCIÓN
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
1,user1@test.com,hash1234567890,2025-01-01 10:00:00
2,user2@test.com,hash0987654321,2025-01-02 11:30:00
3,user3@test.com,hash1111111111,2025-01-03 14:15:00

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
- Database Host: internal-server-01
- Database Port: 5432
- Database Name: application_db
- Username: database_user
- Password: MyPassword123456

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
<head><title>Configuration File</title></head>
<body>
<h1>System Configuration</h1>
<pre>
APPLICATION_KEY=key_application_demo_test_only
DATABASE_PASS=password_database_demo_test_only
API_TOKEN=token_api_demo_test_only_12345
SERVICE_KEY=key_service_demo_test_only
PAYMENT_KEY=key_payment_demo_test_only_67890
WEBHOOK_SECRET=secret_webhook_demo_test_only
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
        email: "person1@test.com",
        password_hash: "hash_value_1234567890abcdef",
        ssn: "123-45-6789",
        credit_card: "4532-1234-5678-9010"
      },
      {
        id: 2,
        email: "person2@test.com",
        password_hash: "hash_value_fedcba0987654321",
        ssn: "987-65-4321",
        credit_card: "5425-4321-0987-6543"
      }
    ],
    database_version: "PostgreSQL 13.5",
    server_path: "/var/www/application"
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
});

// Test 6: Información de configuración del sistema
router.get('/test-sysinfo', (req, res) => {
  const sysinfo = `System Information Dump
=======================
OS: Linux server-01 5.10.0-8-amd64
Kernel: 5.10.0-8-amd64
Hostname: internal-server-01
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
postgres-tools
redis-tools`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.send(sysinfo);
});

module.exports = router;