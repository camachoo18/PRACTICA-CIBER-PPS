# 🌐 Guía Interactiva: Probar el WAF desde el Navegador

**URL de acceso**: `http://localhost`

---

## 1️⃣ ACCESO A LA APLICACIÓN

### Opción A: Navegación Normal (Permitida ✅)

Abre tu navegador e ingresa:

```
http://localhost/login.html
```

**Qué deberías ver:**
- Página de login funcional
- Sin bloqueos del WAF
- Status HTTP: **200 OK**

---

## 2️⃣ PRUEBAS DE NAVEGACIÓN LEGÍTIMA

### Prueba 1: Página de Registro
```
http://localhost/register.html
```
✅ Debe cargar sin problemas

### Prueba 2: Página de Aplicación
```
http://localhost/app
```
✅ Debe cargar sin problemas (puede pedir autenticación)

### Prueba 3: POST a API (en Developer Tools)

Abre la **Consola de Desarrollador** (F12) → Tab **Consola** y ejecuta:

```javascript
// Test 1: Intentar login (datos válidos)
fetch('http://localhost/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "test@example.com",
    password: "Test123456"
  })
})
.then(r => r.json())
.then(data => console.log('Respuesta:', data))
.catch(e => console.error('Error:', e))
```

**Esperado**: Respuesta 401 o 429 (errores legítimos de app, no bloqueado por WAF)

---

## 3️⃣ PRUEBAS DE SEGURIDAD (Ataques Bloqueados ⛔)

### ⚠️ IMPORTANTE: Estas pruebas SERÁN BLOQUEADAS

Ejecuta estos tests en la Consola (F12) para ver el WAF en acción:

### Ataque 1: SQL Injection en Parámetro GET

```javascript
// SQL Injection - SERÁ BLOQUEADO
fetch("http://localhost/api/records?id=1' OR '1'='1")
  .then(r => {
    console.log('Status:', r.status);
    if (r.status === 403) {
      console.log('✅ BLOQUEADO POR WAF (HTTP 403)');
    }
    return r.text();
  })
  .then(data => console.log('Respuesta:', data.substring(0, 200)))
```

**Esperado**: HTTP 403 Forbidden (bloqueado por WAF)

---

### Ataque 2: XSS en JSON

```javascript
// XSS en JSON - SERÁ BLOQUEADO
fetch('http://localhost/api/records', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: "<img src=x onerror=alert('XSS')>",
    peso: 70,
    altura: 1.75
  })
})
.then(r => {
  console.log('Status:', r.status);
  if (r.status === 403) {
    console.log('✅ BLOQUEADO POR WAF (HTTP 403)');
  }
  return r.text();
})
.then(data => console.log('Respuesta:', data.substring(0, 200)))
```

**Esperado**: HTTP 403 Forbidden (bloqueado por WAF)

---

### Ataque 3: Path Traversal

```javascript
// Path Traversal - SERÁ BLOQUEADO
fetch("http://localhost/../../etc/passwd")
  .then(r => {
    console.log('Status:', r.status);
    if (r.status === 403) {
      console.log('✅ BLOQUEADO POR WAF (HTTP 403)');
    }
    return r.text();
  })
```

**Esperado**: HTTP 403 Forbidden (bloqueado por WAF)

---

### Ataque 4: Command Injection

```javascript
// Command Injection - SERÁ BLOQUEADO
fetch("http://localhost/api?cmd=cat%20/etc/passwd")
  .then(r => {
    console.log('Status:', r.status);
    if (r.status === 403) {
      console.log('✅ BLOQUEADO POR WAF (HTTP 403)');
    }
    return r.text();
  })
```

**Esperado**: HTTP 403 Forbidden (bloqueado por WAF)

---

## 4️⃣ VISUALIZAR LOS LOGS EN TIEMPO REAL

Para ver los logs del WAF mientras haces pruebas:

**Terminal 1** (en otra ventana):
```bash
cd /home/alvaro/Escritorio/PRACTICA-CIBER-PPS
sudo docker logs -f imc_waf
```

**Terminal 2** (en otra ventana):
```bash
sudo docker exec imc_waf tail -f /var/log/apache2/modsec_audit.log
```

Mientras ves estos logs, ejecuta los tests en el navegador y verás en tiempo real:
- ✅ Requests permitidas (no aparecen en audit.log)
- ⛔ Requests bloqueadas (aparecen con "Access denied with code 403")

---

## 5️⃣ RESUMEN DE COMPORTAMIENTO ESPERADO

| Prueba | URL/Data | Método | Esperado | WAF |
|--------|----------|--------|----------|-----|
| Login normal | `/api/auth/login` | POST | 401/429 | ✅ Permitido |
| SQL Injection | `?id=1' OR '1'='1` | GET | 403 | ⛔ Bloqueado |
| XSS en JSON | `<img onerror=...>` | POST | 403 | ⛔ Bloqueado |
| Path Traversal | `/../etc/passwd` | GET | 403 | ⛔ Bloqueado |
| Command Injection | `cmd=cat /etc/passwd` | GET | 403 | ⛔ Bloqueado |

---

## 6️⃣ CÓDIGOS HTTP EXPLICADOS

- **200 OK**: Solicitud permitida, respuesta exitosa ✅
- **400 Bad Request**: Error de aplicación (no bloqueado por WAF)
- **401 Unauthorized**: Sin autenticación (no bloqueado por WAF)
- **403 Forbidden**: BLOQUEADO POR WAF ⛔
- **429 Too Many Requests**: Rate limiting (no bloqueado por WAF)

---

## 7️⃣ ¿QUÉ DEMUESTRA ESTO?

✅ El WAF está funcionando correctamente
✅ Ataques comunes son detectados y bloqueados
✅ Navegación legítima funciona sin interrupciones
✅ El paranoia_level=1 es el apropiado (no hay falsos positivos)

---

## 📱 Acceso desde otros dispositivos

Si quieres acceder desde otro equipo en la red:

```
http://<TU_IP_LOCAL>
```

Ejemplo (reemplaza con tu IP real):
```
http://192.168.x.x
```

Para saber tu IP:
```bash
hostname -I
```

---

**Buena suerte con las pruebas y disfruta viendo al WAF en acción! 🛡️**
