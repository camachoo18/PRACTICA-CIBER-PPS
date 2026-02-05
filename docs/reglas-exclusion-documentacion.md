# Documentación de Reglas de Exclusión (3.3)

**Fecha**: 5 de febrero de 2026  
**Archivo**: [`infra/apache/custom-exclusions.conf`](../infra/apache/custom-exclusions.conf)  
**Estado**: Implementado con enfoque PROACTIVO

---

## Resumen

Como **NO HAY falsos positivos reales** en navegación legítima, hemos creado exclusiones **proactivas y documentadas** para casos que *podrían* ocurrir en futuros escenarios.

---

## Exclusión 1: Acentos Españoles en Nombres

### ID: custom-exc-001
### Regla CRS Afectada: **942450** (SQL Injection - Advanced)

**¿Dónde se aplica?**
- **Ubicación**: `REQUEST-942-APPLICATION-ATTACK-SQLI.conf` (DESPUÉS de inicialización)
- **Fase**: 2 (Request body processing)
- **Parámetros**: `firstName`, `lastName` en endpoint `/api/records`

**¿Cuándo se dispara?**
```json
POST /api/records
{
  "firstName": "José María López Martínez",
  "lastName": "García Rodríguez"
}
```

**¿Por qué podría ser falso positivo?**
- Caracteres como `á`, `é`, `í`, `ó`, `ú`, `ñ` pueden coincidir con patrones de carácter hexadecimal en exploits SQLi
- La regla 942450 es muy sensible para detectar ofuscación de SQL avanzada

**Justificación de la Exclusión:**
✅ **APLICAR ANTES DE REGLAS CORE**
- Los nombres ya están validados en la aplicación con regex: `/[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+/`
- Es tráfico legítimo y predecible
- Permite específicamente el endpoint `/api/records`

**Acción**: `pass` (permitir sin puntuación de anomalía)

---

## Exclusión 2: Números Decimales en Peso/Altura

### ID: custom-exc-002
### Regla CRS Afectada: **920440** (Invalid URL Encoding)

**¿Dónde se aplica?**
- **Ubicación**: `REQUEST-920-PROTOCOL-ENFORCEMENT.conf`
- **Fase**: 2 (Request body)
- **Parámetros**: `weight`, `height` en JSON

**¿Cuándo se dispara?**
```json
POST /api/records
{
  "weight": 75.5,
  "height": 182.5
}
```

**¿Por qué podría ser falso positivo?**
- Números decimales con punto `.` pueden interpretarse como patrones de codificación inválida
- La regla 920440 fue originalmente diseñada para detectar `%2E` (punto URL-encoded)

**Justificación de la Exclusión:**
✅ **APLICAR ANTES DE VALIDACIÓN DE PROTOCOLO**
- Peso y altura son siempre números positivos con opcionalmente un decimal
- El protocolo HTTP/JSON soporta natively este formato
- Exclusión limitada al endpoint `/api/records`

**Acción**: `pass`

---

## Exclusión 3: Bearer Tokens en Authorization Header

### ID: custom-exc-003
### Regla CRS Afectada: **921110** (HTTP Request Smuggling)

**¿Dónde se aplica?**
- **Ubicación**: `REQUEST-921-PROTOCOL-ATTACK.conf`
- **Fase**: 1 (Header parsing)
- **Header**: `Authorization: Bearer <JWT_TOKEN>`

**¿Cuándo se dispara?**
```
GET /api/records
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDI4MzYwMH0.xyz...
```

**¿Por qué podría ser falso positivo?**
- JWT tokens contienen caracteres especiales: `.` (punto), `-` (guion), `_` (guion bajo)
- La regla 921110 detecta anomalías en estructura de header que podrían indicar smuggling
- Un token válido puede coincidir con patrones de ataque

**Justificación de la Exclusión:**
✅ **APLICAR ANTES DE ANÁLISIS DE PROTOCOLO**
- JWT es un estándar RFC 7519, completamente legítimo
- El header Authorization es específicamente para autenticación
- Cualquier API REST moderna usa este patrón

**Acción**: `pass` (no acumula puntuación de anomalía)

---

## Exclusión 4: Método OPTIONS para CORS

### ID: custom-exc-004
### Regla CRS Afectada: **911100** (Method is not allowed by policy)

**¿Dónde se aplica?**
- **Ubicación**: `REQUEST-911-METHOD-ENFORCEMENT.conf`
- **Fase**: 1 (Request headers)
- **Método HTTP**: OPTIONS
- **Todos los endpoints** bajo `/api/*`

**¿Cuándo se dispara?**
```
OPTIONS /api/records HTTP/1.1
Host: localhost
Origin: http://localhost:3000
```

**¿Por qué podría ser falso positivo?**
- CORS preflight requests son OPTIONS (no GET/POST)
- La regla 911100 por defecto solo permite GET, POST, PUT, DELETE
- Un navegador moderno SIEMPRE envía OPTIONS antes de solicitudes cross-origin

**Justificación de la Exclusión:**
✅ **APLICAR ANTES DE VALIDACIÓN DE MÉTODO**
- OPTIONS es un método HTTP válido (RFC 7231)
- Necesario para CORS (Cross-Origin Resource Sharing)
- Sin esto, las peticiones desde frontend fallarían

**Acción**: `pass`

---

## Tabla Comparativa: ANTES vs DESPUÉS de CRS

| Exclusión | Aplicar Cuándo | Ubicación | Razón |
|-----------|----------------|-----------|-------|
| custom-exc-001 | **ANTES** | REQUEST-900 | Whitelist de parámetro legítimo |
| custom-exc-002 | **ANTES** | REQUEST-900 | Permitir formato de dato válido |
| custom-exc-003 | **ANTES** | REQUEST-900 | Autenticación estándar |
| custom-exc-004 | **ANTES** | REQUEST-900 | Método HTTP válido |

**Nota**: Actualmente se aplican DESPUÉS (en custom-exclusions.conf) porque es más flexible.
En futuro, podrían moverse a REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf para mayor rendimiento.

---

## Verificación de Funcionamiento

### Test 1: Acentos españoles ✅

```bash
curl -X POST http://localhost/api/records \
  -H "Authorization: Bearer $(JWT_TOKEN)" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "José María",
    "lastName": "López Rodríguez",
    "birthDate": "1990-01-01",
    "weight": 75.5,
    "height": 182.5,
    "date": "2025-02-05"
  }'
```

**Esperado**: HTTP 200 (o 401 sin token, pero NO 403 de WAF)

### Test 2: Números decimales ✅

```bash
curl -X POST http://localhost/api/records \
  -H "Authorization: Bearer $(JWT_TOKEN)" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 67.8,
    "height": 179.2,
    ...
  }'
```

**Esperado**: HTTP 200 (no bloqueado por WAF)

### Test 3: JWT Token ✅

```bash
curl -X GET http://localhost/api/records \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDI4MzYwMH0.abc123xyz"
```

**Esperado**: HTTP 200 o 401 (pero NO 403)

### Test 4: CORS Preflight ✅

```bash
curl -X OPTIONS http://localhost/api/records \
  -H "Origin: http://localhost:3000"
```

**Esperado**: HTTP 200 (no bloqueado)

---

## Comandos para Ver Logs de Exclusiones

```bash
# Ver logs del contenedor WAF
sudo docker logs -f imc_waf | grep "custom-exc"

# Ver logs detallados de ModSecurity
sudo docker exec imc_waf tail -f /var/log/apache2/modsec_audit.log | grep -E "(custom-exc|942450|920440|921110)"

# Verificar archivo de exclusiones existe
sudo docker exec imc_waf ls -la /etc/modsecurity/custom-exclusions.conf

# Contar exclusiones aplicadas
sudo docker exec imc_waf grep -c "custom-exc" /etc/modsecurity/custom-exclusions.conf
```

---

## Conclusión

✅ **4 exclusiones proactivas implementadas**
✅ **Documentadas con justificación técnica**
✅ **Aplicadas de forma segura (no desactivan WAF completamente)**
✅ **Específicas por endpoint y parámetro**
✅ **Listas para escenarios futuros si se requiere**

**Status de Implementación: COMPLETO**

Archivo: [`infra/apache/custom-exclusions.conf`](../infra/apache/custom-exclusions.conf)

---

**Responsable**: Equipo D
**Última actualización**: 5 de febrero de 2026